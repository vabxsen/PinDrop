import { z } from 'zod';
import { emailSchema, passwordSchema } from './auth.schema.js';
import { THEME_VALUES } from '../types/enums.js';

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

export const deleteAccountSchema = z.object({
  password: z.string().max(128).optional().default(''),
});
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
