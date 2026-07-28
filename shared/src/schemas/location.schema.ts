import { z } from 'zod';

export const listLocationsQuerySchema = z.object({
  linkId: z.string().uuid().optional(),
  search: z.string().trim().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
export type ListLocationsQuery = z.infer<typeof listLocationsQuerySchema>;

export const locationIdParamSchema = z.object({
  id: z.string().uuid(),
});
