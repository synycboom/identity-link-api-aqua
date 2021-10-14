import app from '@/app';
import logger from '@/logger';
import { runHealth } from '@/health';

(async () => {
  try {
    await app();
    logger.info('stop running service');
    process.exit();
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error.toString());
    }

    process.exit(1);
  }
})();

runHealth();
