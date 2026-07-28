import { createHash, randomBytes } from 'node:crypto';

export function generateRawToken(): string {
  return randomBytes(40).toString('hex');
}

export function hashToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}
