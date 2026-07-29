import type { User } from '@prisma/client';
import type { AvatarPreset, UserDTO } from '@pindrop/shared';

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    // Stored as a plain column (not a DB enum) so it can't be typed at the Prisma
    // level; setAvatarPreset already validates against AVATAR_PRESET_VALUES before
    // anything is written here, so this cast just reflects that guarantee.
    avatarPreset: user.avatarPreset as AvatarPreset | null,
    username: user.username,
    theme: user.theme,
    hasPassword: user.passwordHash !== null,
    hasGoogleAccount: user.googleId !== null,
    createdAt: user.createdAt.toISOString(),
  };
}
