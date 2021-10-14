import * as settings from '@/setting';
import logger from '@/logger';
import { Fluence } from '@fluencelabs/fluence';
import { krasnodar, Node } from '@fluencelabs/fluence-network-environment';
import { registerService } from '@/service';

const app = async () => {
  const relay = krasnodar[0];
  await connectToRelay(relay);
  await registerService();
  await shutdownOnTerminateSignal();
};

const connectToRelay = async (relay: Node) => {
  await Fluence.start({ connectTo: relay });

  logger.info('[connectToRelay]: connected to the relay', {
    relayPeer: relay,
  });
};

const shutdownOnTerminateSignal = async () => {
  return new Promise((res, rej): void => {
    const terminate = () => {
      logger.info(
        '[shutdownOnTerminateSignal]: got SIGTERM. graceful shutdown start',
        {
          start: new Date().toISOString(),
        }
      );

      setTimeout(() => {
        rej(new Error('[shutdownOnTerminateSignal]: cannot shutdown in time'));
      }, settings.GRACEFUL_SHUTDOWN_IN_SECONDS);

      res(null);
    };

    // listen for TERM signal .e.g. kill
    process.on('SIGTERM', terminate);
    // listen for INT signal e.g. Ctrl-C
    process.on('SIGINT', terminate);
  });
};

export default app;
