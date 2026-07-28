import { PrismaClient } from '@prisma/client';
import { isProd } from '../config/env.js';

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: isProd ? ['error', 'warn'] : ['warn', 'error'],
  });

if (!isProd) {
  global.__prisma = prisma;
}
