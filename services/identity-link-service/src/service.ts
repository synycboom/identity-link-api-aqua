import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import logger from '@/logger';
import registerGithubService from '@/github';
import registerTwitterService from '@/twitter';
import registerWellKnownService from '@/did';
import updateRouter from '@/router';

const relay = krasnodar[0];
const updateRouterIntervalTime = 60 * 1000;
let updateRouterInterval: NodeJS.Timer | undefined;

export const registerService = () => {
  registerGithubService();
  registerTwitterService();
  registerWellKnownService();

  logger.info('[registerService]: registered the services');
};

export const connectToRelay = async () => {
  await Fluence.start({ connectTo: relay });

  logger.info('[connectToRelay]: connected to the relay', {
    relayPeer: relay,
  });

  const { relayPeerId, peerId } = Fluence.getStatus();
  logger.info('[connectToRelay]: connection information', {
    peerId,
    relayPeerId,
  });
};

export const disconnectFromRelay = async () => {
  await Fluence.stop();

  logger.info('[disconnectFromRelay]: disconnected from the relay', {
    relayPeer: relay,
  });
};

export const startRouterHeartbeat = () => {
  const update = () => {
    updateRouter('github-identity-link-service');
    updateRouter('twitter-identity-link-service');
    updateRouter('identity-link-did-service');
  };
  update();
  updateRouterInterval = setInterval(update, updateRouterIntervalTime);
};

export const stopRouterHeartbeat = () => {
  if (updateRouterInterval) {
    clearInterval(updateRouterInterval);
  }
};
