import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

type ReqPart = 'body' | 'query' | 'params';

// Express 5's req.query is a getter-only accessor (no setter), so validated/coerced
// data is attached here instead of reassigning req.query/req.params/req.body directly.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      validated: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export function validate(schema: ZodType, part: ReqPart = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      next(result.error);
      return;
    }
    req.validated ??= {};
    req.validated[part] = result.data;
    next();
  };
}
