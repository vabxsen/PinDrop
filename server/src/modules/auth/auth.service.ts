import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import type { RegisterInput, LoginInput, ResetPasswordInput } from '@pindrop/shared';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { signAccessToken } from '../../lib/jwt.js';
import { generateRawToken, hashToken } from '../../lib/tokenHash.js';
import { sendPasswordResetEmail } from '../../services/mail.service.js';
import { conflict, unauthorized } from '../../lib/httpError.js';
import { toUserDTO } from './auth.mapper.js';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

async function issueTokens(
  userId: string,
  email: string,
  rememberMe: boolean,
  meta: { userAgent?: string; ipAddress?: string },
): Promise<IssuedTokens> {
  const accessToken = signAccessToken({ sub: userId, email });
  const refreshToken = generateRawToken();
  const days = rememberMe
    ? env.JWT_REFRESH_EXPIRES_IN_REMEMBER_DAYS
    : env.JWT_REFRESH_EXPIRES_IN_DAYS;
  const refreshExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      rememberMe,
      expiresAt: refreshExpiresAt,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    },
  });

  return { accessToken, refreshToken, refreshExpiresAt };
}

export async function register(
  input: RegisterInput,
  meta: { userAgent?: string; ipAddress?: string },
) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw conflict('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email: input.email, passwordHash, name: input.name },
  });

  const tokens = await issueTokens(user.id, user.email, false, meta);
  return { user: toUserDTO(user), tokens };
}

export async function login(input: LoginInput, meta: { userAgent?: string; ipAddress?: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.passwordHash) {
    throw unauthorized('Invalid email or password');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw unauthorized('Invalid email or password');
  }

  const tokens = await issueTokens(user.id, user.email, input.rememberMe, meta);
  return { user: toUserDTO(user), tokens };
}

export async function googleLogin(
  idToken: string,
  meta: { userAgent?: string; ipAddress?: string },
) {
  const ticket = await googleClient
    .verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID })
    .catch(() => null);
  const payload = ticket?.getPayload();

  if (!payload?.email || !payload.sub) {
    throw unauthorized('Invalid Google sign-in');
  }
  if (!payload.email_verified) {
    throw unauthorized('Google account email is not verified');
  }

  let user = await prisma.user.findUnique({ where: { googleId: payload.sub } });

  if (!user) {
    const existingByEmail = await prisma.user.findUnique({ where: { email: payload.email } });
    user = existingByEmail
      ? await prisma.user.update({
          where: { id: existingByEmail.id },
          data: { googleId: payload.sub },
        })
      : await prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name ?? null,
            googleId: payload.sub,
          },
        });
  }

  const tokens = await issueTokens(user.id, user.email, false, meta);
  return { user: toUserDTO(user), tokens };
}

export async function refresh(
  rawRefreshToken: string,
  meta: { userAgent?: string; ipAddress?: string },
) {
  const tokenHash = hashToken(rawRefreshToken);
  const existing = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
    throw unauthorized('Session expired, please log in again');
  }

  // Rotate: revoke the old token, issue a brand new one, to block replay of a stolen token.
  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date() },
  });

  const tokens = await issueTokens(existing.userId, existing.user.email, existing.rememberMe, meta);
  return { user: toUserDTO(existing.user), tokens };
}

export async function logout(rawRefreshToken: string | undefined): Promise<void> {
  if (!rawRefreshToken) return;
  const tokenHash = hashToken(rawRefreshToken);
  await prisma.refreshToken
    .updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    })
    .catch(() => undefined);
}

export async function forgotPassword(email: string, appBaseUrl: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always resolve without revealing whether the account exists.
  if (!user) return;

  const rawToken = generateRawToken();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const resetUrl = `${appBaseUrl}/reset-password/${rawToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const tokenHash = hashToken(input.token);
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    throw unauthorized('This password reset link is invalid or has expired');
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
    prisma.refreshToken.updateMany({
      where: { userId: resetToken.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? toUserDTO(user) : null;
}
