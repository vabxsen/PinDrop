import { createServer } from 'node:http';
import { createApp } from './app.js';
import { initSocket } from './lib/socket.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

const app = createApp();
const httpServer = createServer(app);

initSocket(httpServer);

httpServer.listen(env.PORT, () => {
  logger.info(`PinDrop API listening on port ${env.PORT} (${env.NODE_ENV})`);
});

function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down`);
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
