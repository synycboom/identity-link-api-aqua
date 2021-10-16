import {
  connectToRelay,
  disconnectFromRelay,
  registerService,
  startRouterHeartbeat,
  stopRouterHeartbeat,
} from '@/service';
import { shutdownOnTerminateSignal } from '@/signal';
import { onShutdown } from '@/event';
import { initializeCache } from '@/cache';

const app = async () => {
  await initializeCache();
  await connectToRelay();
  startRouterHeartbeat();

  onShutdown(async () => {
    stopRouterHeartbeat();
    await disconnectFromRelay();
  });

  registerService();

  await shutdownOnTerminateSignal();
};

export default app;
