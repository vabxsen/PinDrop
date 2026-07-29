import type { User } from '@prisma/client';
import type { UserDTO } from '@pindrop/shared';

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    username: user.username,
    theme: user.theme,
    hasPassword: user.passwordHash !== null,
    createdAt: user.createdAt.toISOString(),
  };
}
