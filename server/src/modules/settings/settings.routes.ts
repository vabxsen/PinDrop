import { Router } from 'express';
import {
  updateProfileSchema,
  changePasswordSchema,
  updateThemeSchema,
  deleteAccountSchema,
} from '@pindrop/shared';
import { validate } from '../../middleware/validate.middleware.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import * as settingsController from './settings.controller.js';

export const settingsRoutes = Router();

settingsRoutes.use(requireAuth);

settingsRoutes.patch(
  '/profile',
  validate(updateProfileSchema),
  settingsController.updateProfileHandler,
);
settingsRoutes.patch(
  '/password',
  validate(changePasswordSchema),
  settingsController.changePasswordHandler,
);
settingsRoutes.patch('/theme', validate(updateThemeSchema), settingsController.updateThemeHandler);
settingsRoutes.delete(
  '/account',
  validate(deleteAccountSchema),
  settingsController.deleteAccountHandler,
);
