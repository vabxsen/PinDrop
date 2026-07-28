import type { Request, Response } from 'express';
import type { CreateLinkInput, UpdateLinkInput, SetLinkDisabledInput } from '@pindrop/shared';
import * as linksService from './links.service.js';

export async function listLinksHandler(req: Request, res: Response) {
  const links = await linksService.listLinks(req.user!.id);
  res.json({ items: links });
}

export async function getLinkHandler(req: Request, res: Response) {
  const { id } = req.validated.params as { id: string };
  const link = await linksService.getLink(req.user!.id, id);
  res.json({ link });
}

export async function createLinkHandler(req: Request, res: Response) {
  const input = req.validated.body as CreateLinkInput;
  const link = await linksService.createLink(req.user!.id, input);
  res.status(201).json({ link });
}

export async function updateLinkHandler(req: Request, res: Response) {
  const { id } = req.validated.params as { id: string };
  const input = req.validated.body as UpdateLinkInput;
  const link = await linksService.updateLink(req.user!.id, id, input);
  res.json({ link });
}

export async function disableLinkHandler(req: Request, res: Response) {
  const { id } = req.validated.params as { id: string };
  const { disabled } = req.validated.body as SetLinkDisabledInput;
  const link = await linksService.setLinkDisabled(req.user!.id, id, disabled);
  res.json({ link });
}

export async function duplicateLinkHandler(req: Request, res: Response) {
  const { id } = req.validated.params as { id: string };
  const link = await linksService.duplicateLink(req.user!.id, id);
  res.status(201).json({ link });
}

export async function deleteLinkHandler(req: Request, res: Response) {
  const { id } = req.validated.params as { id: string };
  await linksService.deleteLink(req.user!.id, id);
  res.status(204).send();
}
