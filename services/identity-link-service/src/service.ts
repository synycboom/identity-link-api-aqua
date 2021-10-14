import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import logger from '@/logger';
import registerGithubService from '@/github';

const relay = krasnodar[0];

export const registerService = () => {
  registerGithubService();

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
