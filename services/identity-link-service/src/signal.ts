import * as settings from '@/setting';
import logger from '@/logger';
import { emitStartShuttingDown, onShutdownComplete } from '@/event';

export const shutdownOnTerminateSignal = async () => {
  return new Promise((resolve, reject): void => {
    const terminate = async () => {
      logger.info(
        '[shutdownOnTerminateSignal]: got SIGTERM. graceful shutdown start',
        {
          start: new Date().toISOString(),
        }
      );

      onShutdownComplete(async () => {
        resolve(null);
      });

      emitStartShuttingDown();

      setTimeout(() => {
        reject(
          new Error('[shutdownOnTerminateSignal]: cannot shutdown in time')
        );
      }, settings.GRACEFUL_SHUTDOWN_IN_SECONDS * 1000);
    };

    // listen for TERM signal .e.g. kill
    process.on('SIGTERM', terminate);
    // listen for INT signal e.g. Ctrl-C
    process.on('SIGINT', terminate);
  });
};
