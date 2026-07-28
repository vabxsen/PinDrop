import bcrypt from 'bcryptjs';
import type {
  UpdateProfileInput,
  ChangePasswordInput,
  UpdateThemeInput,
  DeleteAccountInput,
} from '@pindrop/shared';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { conflict, unauthorized, notFound } from '../../lib/httpError.js';
import { toUserDTO } from '../auth/auth.mapper.js';

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
