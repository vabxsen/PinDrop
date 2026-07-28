import { z } from 'zod';

export const visitorLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  accuracy: z.number().min(0).max(200_000).optional().nullable(),
  capturedAt: z.string().datetime().optional().nullable(),
  timezone: z.string().max(100).optional().nullable(),
  language: z.string().max(35).optional().nullable(),
  screenResolution: z
    .string()
    .max(20)
    .regex(/^\d+x\d+$/)
    .optional()
    .nullable(),
  viewportSize: z
    .string()
    .max(20)
    .regex(/^\d+x\d+$/)
    .optional()
    .nullable(),
});
export type VisitorLocationInput = z.infer<typeof visitorLocationSchema>;

export const visitorDeclineSchema = z.object({
  reason: z
    .enum(['user_denied', 'timeout', 'unsupported', 'error'])
    .optional()
    .default('user_denied'),
});
export type VisitorDeclineInput = z.infer<typeof visitorDeclineSchema>;
