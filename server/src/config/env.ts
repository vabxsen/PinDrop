import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_URL: z.string().url(),

  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(7),
  JWT_REFRESH_EXPIRES_IN_REMEMBER_DAYS: z.coerce.number().int().positive().default(30),

  COOKIE_SECRET: z.string().min(32),
  CSRF_SECRET: z.string().min(32),

  GOOGLE_CLIENT_ID: z.string().min(1),

  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(4).max(15).default(12),

  NOMINATIM_BASE_URL: z.string().url().default('https://nominatim.openstreetmap.org'),
  NOMINATIM_USER_AGENT: z.string().min(1).default('PinDrop/1.0'),
  NOMINATIM_MIN_INTERVAL_MS: z.coerce.number().int().positive().default(1000),
  NOMINATIM_CACHE_TTL_DAYS: z.coerce.number().int().positive().default(30),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  VISITOR_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),

  // Comma-separated list. Firebase Hosting's CDN cannot proxy WebSocket upgrades, so the
  // client opens its socket straight against Cloud Run instead of going through the
  // /socket.io/** rewrite. That makes the connection cross-origin, and the site answers on
  // both pindrop-locationtracker.web.app and .firebaseapp.com, so both have to be allowed.
  SOCKET_CORS_ORIGIN: z
    .string()
    .min(1)
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().url()).min(1)),

  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_FROM: z.string().default('PinDrop <no-reply@pindrop.app>'),

  LOG_LEVEL: z.string().default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
