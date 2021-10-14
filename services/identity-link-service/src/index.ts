import app from '@/app';
import logger from '@/logger';
import { runHealth } from '@/health';

(async () => {
  try {
    await app();
    logger.info('stop running service');
    process.exit();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
})();

runHealth();
