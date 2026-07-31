import { Router } from 'express';
import {
  updateProfileSchema,
  changePasswordSchema,
  updateThemeSchema,
  deleteAccountSchema,
  setUsernameSchema,
  setAvatarPresetSchema,
  googleLoginSchema,
} from '@pindrop/shared';
import { validate } from '../../middleware/validate.middleware.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { authRateLimiter } from '../../middleware/rateLimit.middleware.js';
import * as settingsController from './settings.controller.js';

export const settingsRoutes = Router();

settingsRoutes.use(requireAuth);

// These three verify a password inside the handler (email change, password change,
// account deletion), so they get the stricter auth limiter rather than the generous
// global one — otherwise a stolen access token turns into many more password guesses
// than login itself allows.
settingsRoutes.patch(
  '/profile',
  authRateLimiter,
  validate(updateProfileSchema),
  settingsController.updateProfileHandler,
);
settingsRoutes.patch(
  '/password',
  authRateLimiter,
  validate(changePasswordSchema),
  settingsController.changePasswordHandler,
);
settingsRoutes.patch('/theme', validate(updateThemeSchema), settingsController.updateThemeHandler);
settingsRoutes.patch(
  '/username',
  validate(setUsernameSchema),
  settingsController.setUsernameHandler,
);
settingsRoutes.patch(
  '/avatar',
  validate(setAvatarPresetSchema),
  settingsController.setAvatarPresetHandler,
);
settingsRoutes.delete('/avatar', settingsController.clearAvatarPresetHandler);
settingsRoutes.patch('/google', validate(googleLoginSchema), settingsController.linkGoogleHandler);
settingsRoutes.delete('/google', settingsController.unlinkGoogleHandler);
settingsRoutes.delete(
  '/account',
  authRateLimiter,
  validate(deleteAccountSchema),
  settingsController.deleteAccountHandler,
);
