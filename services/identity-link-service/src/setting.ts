import logger from '@/logger';

const strToNumber = (value: string): number => {
  return parseInt(value, 10);
};

const requireEnv = (name: string): string => {
  const env = process.env[name];
  if (!env) {
    logger.error(`[requireEnv]: ${name} is not set`);
    process.exit(1);
  }

  return env;
};

export const PRIVATE_KEY = requireEnv('PRIVATE_KEY');

export const GRACEFUL_SHUTDOWN_IN_SECONDS = strToNumber(
  requireEnv('GRACEFUL_SHUTDOWN_IN_SECONDS')
);

export const APP_PORT = strToNumber(requireEnv('APP_PORT'));

export const REDIS_USERNAME = requireEnv('REDIS_USERNAME');

export const REDIS_PASSWORD = requireEnv('REDIS_PASSWORD');

export const REDIS_HOST = requireEnv('REDIS_HOST');

export const REDIS_CACHE_TTL_IN_MINUTES = strToNumber(
  requireEnv('REDIS_CACHE_TTL_IN_MINUTES')
);

export const GITHUB_PERSONAL_ACCESS_TOKEN = requireEnv(
  'GITHUB_PERSONAL_ACCESS_TOKEN'
);
