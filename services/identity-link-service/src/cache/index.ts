import * as settings from '@/setting';
import { createClient } from 'redis';
import logger from '@/logger';

const url = `redis://${settings.REDIS_USERNAME}:${settings.REDIS_PASSWORD}@${settings.REDIS_HOST}`;
const ttl = settings.REDIS_CACHE_TTL_IN_MINUTES * 60;
const client = createClient({
  url,
});

export const initializeCache = async () => {
  await client.connect();

  logger.info('[initializeCache]: connected to Redis');
};

export const set = async <T>(key: string, payload: T) => {
  const data = JSON.stringify(payload);
  await client.setEx(key, ttl, data);
};

export const get = async <T>(key: string): Promise<T | null> => {
  const payload = await client.get(key);
  if (!payload) {
    return null;
  }

  return JSON.parse(payload) as T;
};
