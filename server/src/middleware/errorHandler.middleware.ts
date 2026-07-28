import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { HttpError } from '../lib/httpError.js';
import { logger } from '../lib/logger.js';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Not found: ${req.method} ${req.path}` });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join('.') || '_root';
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    res.status(400).json({ message: 'Validation failed', errors: fieldErrors });
    return;
  }

  if (err instanceof HttpError) {
    if (err.status >= 500) {
      logger.error({ err }, err.message);
    }
    res
      .status(err.status)
      .json({ message: err.message, ...(err.errors ? { errors: err.errors } : {}) });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({ message: 'A record with this value already exists' });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ message: 'Record not found' });
      return;
    }
    logger.error({ err }, 'Prisma error');
    res.status(500).json({ message: 'Database error' });
    return;
  }

  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ message: 'Internal server error' });
}
