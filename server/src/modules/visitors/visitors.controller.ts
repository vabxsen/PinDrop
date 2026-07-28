import type { Request, Response } from 'express';
import type { VisitorLocationInput, VisitorDeclineInput } from '@pindrop/shared';
import * as visitorsService from './visitors.service.js';

function visitorMeta(req: Request) {
  return {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  };
}

export async function getLinkMetaHandler(req: Request, res: Response) {
  const { shortId } = req.validated.params as { shortId: string };
  const meta = await visitorsService.getPublicLinkMeta(shortId);
  res.json(meta);
}

export async function submitLocationHandler(req: Request, res: Response) {
  const { shortId } = req.validated.params as { shortId: string };
  const input = req.validated.body as VisitorLocationInput;
  const result = await visitorsService.recordGrantedLocation(shortId, input, visitorMeta(req));
  res.status(201).json(result);
}

export async function submitDeclineHandler(req: Request, res: Response) {
  const { shortId } = req.validated.params as { shortId: string };
  const input = req.validated.body as VisitorDeclineInput;
  const result = await visitorsService.recordDeclinedVisit(shortId, input, visitorMeta(req));
  res.status(201).json(result);
}
