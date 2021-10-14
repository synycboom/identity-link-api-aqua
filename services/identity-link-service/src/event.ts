import EventEmitter from 'events';
import logger from '@/logger';

type cb = () => Promise<void>;

const startShuttingdownEvent = 'shutdown';
const listeners: cb[] = [];
const shutdownCompletedListeners: cb[] = [];
const eventEmitter = new EventEmitter();

eventEmitter.addListener(startShuttingdownEvent, async () => {
  const promises = listeners.map(fn => fn());
  const results = await Promise.allSettled(promises);
  const hasErr = results.some(res => res.status === 'rejected');

  if (hasErr) {
    logger.error('[eventEmitter]: call some listeners are not success');
  }

  results.forEach(res => {
    if (res.status === 'rejected') {
      logger.error(res.reason.toString());
    }
  });

  shutdownCompletedListeners.forEach(fn => fn());
});

export const onShutdown = (fn: cb) => {
  listeners.push(fn);
};

export const onShutdownComplete = (fn: cb) => {
  shutdownCompletedListeners.push(fn);
};

export const emitStartShuttingDown = () => {
  eventEmitter.emit(startShuttingdownEvent);
};
