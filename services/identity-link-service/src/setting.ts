import logger from '@/logger';

const strToNumber = (value: string): number => {
  return parseInt(value, 10);
};

const strToSeconds = (value: string): number => {
  const num = parseInt(value, 10);

  return num * 1000;
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

export const GRACEFUL_SHUTDOWN_IN_SECONDS = strToSeconds(
  requireEnv('GRACEFUL_SHUTDOWN_IN_SECONDS')
);
