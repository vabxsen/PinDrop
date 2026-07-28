import { Router } from 'express';
import { visitorLocationSchema, visitorDeclineSchema, shortIdParamSchema } from '@pindrop/shared';
import { validate } from '../../middleware/validate.middleware.js';
import { visitorRateLimiter } from '../../middleware/rateLimit.middleware.js';
import * as visitorsController from './visitors.controller.js';

export const visitorRoutes = Router();

visitorRoutes.get(
  '/:shortId',
  validate(shortIdParamSchema, 'params'),
  visitorsController.getLinkMetaHandler,
);

visitorRoutes.post(
  '/:shortId/location',
  visitorRateLimiter,
  validate(shortIdParamSchema, 'params'),
  validate(visitorLocationSchema),
  visitorsController.submitLocationHandler,
);

visitorRoutes.post(
  '/:shortId/decline',
  visitorRateLimiter,
  validate(shortIdParamSchema, 'params'),
  validate(visitorDeclineSchema),
  visitorsController.submitDeclineHandler,
);
