import type { Request, Response } from 'express';
import type {
  RegisterInput,
  LoginInput,
  GoogleLoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UserDTO,
} from '@pindrop/shared';
import * as authService from './auth.service.js';
import type { IssuedTokens } from './auth.service.js';
import { generateCsrfToken } from '../../middleware/csrf.middleware.js';
import { REFRESH_TOKEN_COOKIE_NAME } from '../../config/constants.js';
import { env, isProd } from '../../config/env.js';
import { unauthorized } from '../../lib/httpError.js';

function requestMeta(req: Request) {
  return {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  };
}

function setRefreshCookie(res: Response, token: string, expiresAt: Date) {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
    signed: true,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: '/' });
}

function respondWithSession(
  req: Request,
  res: Response,
  status: number,
  result: { user: UserDTO; tokens: IssuedTokens },
) {
  setRefreshCookie(res, result.tokens.refreshToken, result.tokens.refreshExpiresAt);
  const csrfToken = generateCsrfToken(req, res);
  res.status(status).json({
    user: result.user,
    accessToken: result.tokens.accessToken,
    csrfToken,
  });
}

export async function registerHandler(req: Request, res: Response) {
  const input = req.validated.body as RegisterInput;
  const result = await authService.register(input, requestMeta(req));
  respondWithSession(req, res, 201, result);
}

export async function loginHandler(req: Request, res: Response) {
  const input = req.validated.body as LoginInput;
  const result = await authService.login(input, requestMeta(req));
  respondWithSession(req, res, 200, result);
}

export async function googleLoginHandler(req: Request, res: Response) {
  const input = req.validated.body as GoogleLoginInput;
  const result = await authService.googleLogin(input.idToken, requestMeta(req));
  respondWithSession(req, res, 200, result);
}

export async function refreshHandler(req: Request, res: Response) {
  const rawRefreshToken = req.signedCookies?.[REFRESH_TOKEN_COOKIE_NAME] as string | undefined;
  if (!rawRefreshToken) {
    throw unauthorized('No active session');
  }
  const result = await authService.refresh(rawRefreshToken, requestMeta(req));
  respondWithSession(req, res, 200, result);
}

export async function logoutHandler(req: Request, res: Response) {
  const rawRefreshToken = req.signedCookies?.[REFRESH_TOKEN_COOKIE_NAME] as string | undefined;
  await authService.logout(rawRefreshToken);
  clearRefreshCookie(res);
  res.status(204).send();
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  const input = req.validated.body as ForgotPasswordInput;
  await authService.forgotPassword(input.email, env.CLIENT_URL);
  res.status(202).json({ message: 'If that email is registered, a reset link has been sent.' });
}

export async function resetPasswordHandler(req: Request, res: Response) {
  const input = req.validated.body as ResetPasswordInput;
  await authService.resetPassword(input);
  res.status(200).json({ message: 'Password updated successfully.' });
}

export async function meHandler(req: Request, res: Response) {
  const user = await authService.getUserById(req.user!.id);
  if (!user) {
    throw unauthorized('User not found');
  }
  res.json({ user });
}
