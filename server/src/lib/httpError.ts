export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const notFound = (message = 'Not found') => new HttpError(404, message);
export const badRequest = (message = 'Bad request', errors?: Record<string, string[]>) =>
  new HttpError(400, message, errors);
export const unauthorized = (message = 'Unauthorized') => new HttpError(401, message);
export const forbidden = (message = 'Forbidden') => new HttpError(403, message);
export const conflict = (message = 'Conflict') => new HttpError(409, message);
export const tooManyRequests = (message = 'Too many requests') => new HttpError(429, message);
