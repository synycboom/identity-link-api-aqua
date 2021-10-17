const requireEnv = (name: string): string => {
  const env = process.env[name];
  if (!env) {
    throw new Error(`[requireEnv]: ${name} is not set`);
  }
  return env;
};

export default {
  REACT_APP_CERAMIC_URL: requireEnv('REACT_APP_CERAMIC_URL'),
};
