import http from 'http';
import logger from '@/logger';
import { onShutdown } from '@/event';

export const runHealth = () => {
  const server = http.createServer((_, res) => {
    res.writeHead(200);
    res.end('ok');
  });

  onShutdown(async () => {
    logger.info('[runHealth]: stop running health server');
    server.close();
  });

  logger.info('[runHealth]: start running health server');
  server.listen(8080);
};
