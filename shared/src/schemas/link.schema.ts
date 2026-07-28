import { z } from 'zod';

export const createLinkSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  description: z.string().trim().max(500).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  maxUses: z.number().int().positive().max(1_000_000).optional().nullable(),
});
export type CreateLinkInput = z.infer<typeof createLinkSchema>;

export const updateLinkSchema = createLinkSchema.partial();
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export const setLinkDisabledSchema = z.object({
  disabled: z.boolean().optional().default(true),
});
export type SetLinkDisabledInput = z.infer<typeof setLinkDisabledSchema>;

export const linkIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const shortIdParamSchema = z.object({
  shortId: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^[A-Za-z0-9_-]+$/, 'Invalid link id'),
});
