import type { Request, Response } from 'express';
import type {
  UpdateProfileInput,
  ChangePasswordInput,
  UpdateThemeInput,
  DeleteAccountInput,
} from '@pindrop/shared';
import * as settingsService from './settings.service.js';
import { REFRESH_TOKEN_COOKIE_NAME } from '../../config/constants.js';

export async function updateProfileHandler(req: Request, res: Response) {
  const input = req.validated.body as UpdateProfileInput;
  const user = await settingsService.updateProfile(req.user!.id, input);
  res.json({ user });
}

export async function changePasswordHandler(req: Request, res: Response) {
  const input = req.validated.body as ChangePasswordInput;
  await settingsService.changePassword(req.user!.id, input);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: '/' });
  res.json({ message: 'Password updated. Please log in again.' });
}

export async function updateThemeHandler(req: Request, res: Response) {
  const input = req.validated.body as UpdateThemeInput;
  const user = await settingsService.updateTheme(req.user!.id, input);
  res.json({ user });
}

export async function deleteAccountHandler(req: Request, res: Response) {
  const input = req.validated.body as DeleteAccountInput;
  await settingsService.deleteAccount(req.user!.id, input);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: '/' });
  res.status(204).send();
}
