import { Router } from 'express';
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@pindrop/shared';
import { validate } from '../../middleware/validate.middleware.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { authRateLimiter } from '../../middleware/rateLimit.middleware.js';
import { doubleCsrfProtection } from '../../middleware/csrf.middleware.js';
import * as authController from './auth.controller.js';

export const authRoutes = Router();

authRoutes.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  authController.registerHandler,
);

authRoutes.post('/login', authRateLimiter, validate(loginSchema), authController.loginHandler);

authRoutes.post(
  '/google',
  authRateLimiter,
  validate(googleLoginSchema),
  authController.googleLoginHandler,
);

authRoutes.post('/refresh', authRateLimiter, doubleCsrfProtection, authController.refreshHandler);

authRoutes.post('/logout', doubleCsrfProtection, authController.logoutHandler);

authRoutes.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPasswordHandler,
);

authRoutes.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPasswordHandler,
);

authRoutes.get('/me', requireAuth, authController.meHandler);
