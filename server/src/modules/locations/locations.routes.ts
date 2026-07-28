import { Router } from 'express';
import { listLocationsQuerySchema, locationIdParamSchema } from '@pindrop/shared';
import { validate } from '../../middleware/validate.middleware.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import * as locationsController from './locations.controller.js';

export const locationRoutes = Router();

locationRoutes.use(requireAuth);

// Registered before the generic list route's query schema so `export.csv` isn't
// swallowed by pagination-only validation; it reuses the same filter fields.
locationRoutes.get(
  '/export.csv',
  validate(listLocationsQuerySchema.pick({ linkId: true, search: true }), 'query'),
  locationsController.exportLocationsCsvHandler,
);

locationRoutes.get(
  '/',
  validate(listLocationsQuerySchema, 'query'),
  locationsController.listLocationsHandler,
);

locationRoutes.delete(
  '/:id',
  validate(locationIdParamSchema, 'params'),
  locationsController.deleteLocationHandler,
);
