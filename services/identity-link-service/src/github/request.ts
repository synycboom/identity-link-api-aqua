import { randomString } from '@stablelib/random';
import { GithubRequestParams, Challenge } from '@/github/type';
import { onRequestResult } from '@/_aqua/github-requester';
import * as cache from '@/cache';
import logger from '@/logger';
import { challengeKey } from '@/github/util';

const validationError = (requestId: string, message: string) => ({
  code: 400,
  data: { challengeCode: '' },
  requestId,
  error: message,
});

const internalError = (requestId: string, message: string) => ({
  code: 500,
  data: { challengeCode: '' },
  requestId,
  error: message,
});

const success = (requestId: string, challengeCode: string) => ({
  code: 200,
  data: { challengeCode },
  requestId,
  error: '',
});

export default async function sendChallenge(
  req: GithubRequestParams[0],
  requestId: GithubRequestParams[1],
  reqPeer: GithubRequestParams[2],
  callParams: GithubRequestParams[3]
) {
  logger.info('[sendChallenge]: prepare sending a challenge', {
    req,
    requestId,
  });

  const challengeCode = randomString(32);
  const { did, username } = req;
  const data: Challenge = {
    did,
    username,
    timestamp: Date.now(),
    challengeCode,
  };

  if (!username) {
    return await onRequestResult(
      validationError(requestId, `"username" is required`),
      reqPeer
    );
  }

  if (!did) {
    return await onRequestResult(
      validationError(requestId, `"did" is required`),
      reqPeer
    );
  }

  try {
    await cache.set(challengeKey(did), data);
  } catch (err) {
    await onRequestResult(
      internalError(requestId, 'Internal Server Error'),
      reqPeer
    );

    throw err;
  }

  await onRequestResult(success(requestId, challengeCode), reqPeer);

  logger.info('[sendChallenge]: done sending a challenge', {
    req,
    requestId,
  });
}
