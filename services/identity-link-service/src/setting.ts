import fs from 'fs';
import path from 'path';
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

const optionalEnv = (name: string): string => {
  return process.env[name] || '';
};

export const CERAMIC_CLIENT_URL = requireEnv('CERAMIC_CLIENT_URL');

export const VERIFICATION_ISSUER_DOMAIN = requireEnv(
  'VERIFICATION_ISSUER_DOMAIN'
);

export const ES256K_PRIVATE_KEY_HEX = fs.readFileSync(
  path.join(__dirname, '../keys/secp256k1-private.hex'),
  { encoding: 'ascii' }
);

export const ES256K_PUBLIC_KEY_HEX = fs.readFileSync(
  path.join(__dirname, '../keys/secp256k1-public.hex'),
  { encoding: 'ascii' }
);

export const ED25519_PRIVATE_KEY_PEM = fs.readFileSync(
  path.join(__dirname, '../keys/ed25519-private.pem'),
  { encoding: 'ascii' }
);

export const GRACEFUL_SHUTDOWN_IN_SECONDS = strToNumber(
  requireEnv('GRACEFUL_SHUTDOWN_IN_SECONDS')
);

export const APP_PORT = strToNumber(requireEnv('APP_PORT'));

export const REDIS_USERNAME = optionalEnv('REDIS_USERNAME');

export const REDIS_PASSWORD = optionalEnv('REDIS_PASSWORD');

export const REDIS_HOST = requireEnv('REDIS_HOST');

export const REDIS_CACHE_TTL_IN_MINUTES = strToNumber(
  requireEnv('REDIS_CACHE_TTL_IN_MINUTES')
);

export const GITHUB_PERSONAL_ACCESS_TOKEN = requireEnv(
  'GITHUB_PERSONAL_ACCESS_TOKEN'
);

export const TWITTER_CONSUMER_KEY = requireEnv('TWITTER_CONSUMER_KEY');

export const TWITTER_CONSUMER_SECRET = requireEnv('TWITTER_CONSUMER_KEY');

export const TWITTER_BEARER_TOKEN = requireEnv('TWITTER_BEARER_TOKEN');
