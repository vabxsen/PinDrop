import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { globalRateLimiter } from './middleware/rateLimit.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { linkRoutes } from './modules/links/links.routes.js';
import { visitorRoutes } from './modules/visitors/visitors.routes.js';
import { locationRoutes } from './modules/locations/locations.routes.js';
import { settingsRoutes } from './modules/settings/settings.routes.js';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes.js';

export function createApp() {
  const app = express();

  // Render/other reverse proxies sit in front of us; trust the first hop so
  // req.ip and req.secure reflect the real client (needed for geoip + rate limiting).
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: false, // API-only server; CSP is enforced on the client app instead
    }),
  );
  app.use(
    cors({
      origin: [env.CLIENT_URL],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '20kb' }));
  app.use(cookieParser(env.COOKIE_SECRET));
  app.use(compression());
  app.use(pinoHttp({ logger, autoLogging: env.NODE_ENV !== 'test' }));
  app.use(globalRateLimiter);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/links', linkRoutes);
  app.use('/api/l', visitorRoutes);
  app.use('/api/locations', locationRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
