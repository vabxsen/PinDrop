import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import type {
  UpdateProfileInput,
  ChangePasswordInput,
  UpdateThemeInput,
  DeleteAccountInput,
  SetUsernameInput,
  SetAvatarPresetInput,
  GoogleLoginInput,
} from '@pindrop/shared';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { conflict, unauthorized, notFound } from '../../lib/httpError.js';
import { toUserDTO } from '../auth/auth.mapper.js';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  if (input.email) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing && existing.id !== userId) {
      throw conflict('An account with this email already exists');
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.email !== undefined ? { email: input.email } : {}),
    },
  });

  return toUserDTO(user);
}

export async function changePassword(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw notFound('User not found');

  if (user.passwordHash) {
    const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!valid) throw unauthorized('Current password is incorrect');
  }

  const passwordHash = await bcrypt.hash(input.newPassword, env.BCRYPT_SALT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
}

export async function updateTheme(userId: string, input: UpdateThemeInput) {
  const user = await prisma.user.update({ where: { id: userId }, data: { theme: input.theme } });
  return toUserDTO(user);
}

export async function setUsername(userId: string, input: SetUsernameInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw notFound('User not found');
  // Permanent by design: once set, there's no route back through this handler.
  if (user.username) throw conflict('Username is already set and cannot be changed');

  const existing = await prisma.user.findUnique({ where: { username: input.username } });
  if (existing) throw conflict('That username is already taken');

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { username: input.username },
  });
  return toUserDTO(updated);
}

export async function setAvatarPreset(userId: string, input: SetAvatarPresetInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatarPreset: input.avatarPreset },
  });
  return toUserDTO(user);
}

export async function clearAvatarPreset(userId: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatarPreset: null },
  });
  return toUserDTO(user);
}

export async function linkGoogle(userId: string, input: GoogleLoginInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw notFound('User not found');
  if (user.googleId) throw conflict('A Google account is already connected');

  const ticket = await googleClient
    .verifyIdToken({ idToken: input.idToken, audience: env.GOOGLE_CLIENT_ID })
    .catch(() => null);
  const payload = ticket?.getPayload();
  if (!payload?.sub || !payload.email_verified) {
    throw unauthorized('Invalid Google account');
  }

  const existing = await prisma.user.findUnique({ where: { googleId: payload.sub } });
  if (existing) {
    throw conflict('That Google account is already connected to a different PinDrop account');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { googleId: payload.sub, avatarUrl: payload.picture ?? user.avatarUrl },
  });
  return toUserDTO(updated);
}

export async function unlinkGoogle(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw notFound('User not found');
  if (!user.googleId) throw conflict('No Google account is connected');
  // Would otherwise strand the account with no way to sign back in.
  if (!user.passwordHash) {
    throw conflict('Set a password before disconnecting Google, so you can still sign in');
  }

  const updated = await prisma.user.update({ where: { id: userId }, data: { googleId: null } });
  return toUserDTO(updated);
}

export async function deleteAccount(userId: string, input: DeleteAccountInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw notFound('User not found');

  if (user.passwordHash) {
    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw unauthorized('Password is incorrect');
  }

  // Cascades to links, location records, refresh tokens, and reset tokens via
  // onDelete: Cascade in the Prisma schema.
  await prisma.user.delete({ where: { id: userId } });
}
