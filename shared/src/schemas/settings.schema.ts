import { z } from 'zod';
import { emailSchema, passwordSchema } from './auth.schema.js';
import { AVATAR_PRESET_VALUES, THEME_VALUES } from '../types/enums.js';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(100).optional().nullable(),
  email: emailSchema.optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().max(128).optional().default(''),
  newPassword: passwordSchema,
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const updateThemeSchema = z.object({
  theme: z.enum(THEME_VALUES),
});
export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;

// Lowercase only (case preserved as typed would make "Foo" and "foo" collide on
// lookup anyway) so the uniqueness check and storage always agree on one casing.
export const setUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z][a-z0-9_]{2,19}$/,
      'Use 3-20 characters: lowercase letters, numbers, and underscores, starting with a letter.',
    ),
});
export type SetUsernameInput = z.infer<typeof setUsernameSchema>;

export const setAvatarPresetSchema = z.object({
  avatarPreset: z.enum(AVATAR_PRESET_VALUES),
});
export type SetAvatarPresetInput = z.infer<typeof setAvatarPresetSchema>;

export const deleteAccountSchema = z.object({
  password: z.string().max(128).optional().default(''),
});
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
