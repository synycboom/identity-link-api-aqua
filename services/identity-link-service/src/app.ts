import {
  connectToRelay,
  disconnectFromRelay,
  registerService,
} from '@/service';
import { shutdownOnTerminateSignal } from '@/signal';
import { onShutdown } from '@/event';
import { initializeCache } from '@/cache';

const app = async () => {
  await initializeCache();
  await connectToRelay();

  onShutdown(async () => {
    await disconnectFromRelay();
  });

  registerService();

  await shutdownOnTerminateSignal();
};

export default app;
