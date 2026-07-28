import { Router } from 'express';
import {
  createLinkSchema,
  updateLinkSchema,
  setLinkDisabledSchema,
  linkIdParamSchema,
} from '@pindrop/shared';
import { validate } from '../../middleware/validate.middleware.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import * as linksController from './links.controller.js';

export const linkRoutes = Router();

linkRoutes.use(requireAuth);

linkRoutes.get('/', linksController.listLinksHandler);
linkRoutes.post('/', validate(createLinkSchema), linksController.createLinkHandler);

linkRoutes.get('/:id', validate(linkIdParamSchema, 'params'), linksController.getLinkHandler);
linkRoutes.patch(
  '/:id',
  validate(linkIdParamSchema, 'params'),
  validate(updateLinkSchema),
  linksController.updateLinkHandler,
);
linkRoutes.patch(
  '/:id/disable',
  validate(linkIdParamSchema, 'params'),
  validate(setLinkDisabledSchema),
  linksController.disableLinkHandler,
);
linkRoutes.post(
  '/:id/duplicate',
  validate(linkIdParamSchema, 'params'),
  linksController.duplicateLinkHandler,
);
linkRoutes.delete('/:id', validate(linkIdParamSchema, 'params'), linksController.deleteLinkHandler);
