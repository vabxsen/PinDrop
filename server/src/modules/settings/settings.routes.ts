import { Router } from 'express';
import {
  updateProfileSchema,
  changePasswordSchema,
  updateThemeSchema,
  deleteAccountSchema,
  setUsernameSchema,
  googleLoginSchema,
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
settingsRoutes.patch(
  '/username',
  validate(setUsernameSchema),
  settingsController.setUsernameHandler,
);
settingsRoutes.patch('/google', validate(googleLoginSchema), settingsController.linkGoogleHandler);
settingsRoutes.delete('/google', settingsController.unlinkGoogleHandler);
settingsRoutes.delete(
  '/account',
  validate(deleteAccountSchema),
  settingsController.deleteAccountHandler,
);
