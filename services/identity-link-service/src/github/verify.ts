import { request } from '@octokit/request';
import fetch from 'node-fetch';
import { Challenge, GithubVerifyParams } from '@/github/type';
import { onVerifyResult } from '@/_aqua/github-requester';
import * as settings from '@/setting';
import * as cache from '@/cache';
import logger from '@/logger';
import { challengeKey } from '@/github/util';
import { verifyJWS } from '@/github/claim';

const token = settings.GITHUB_PERSONAL_ACCESS_TOKEN;
if (!token) {
  throw new Error('[register]: no personal access token');
}

const client = request.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

const validationError = (requestId: string, message: string) => ({
  code: 400,
  data: { attestation: '' },
  requestId,
  error: message,
});

const internalError = (requestId: string, message: string) => ({
  code: 500,
  data: { attestation: '' },
  requestId,
  error: message,
});

const permissionError = (requestId: string, message: string) => ({
  code: 403,
  data: { attestation: '' },
  requestId,
  error: message,
});

const success = (requestId: string, attestation: string) => ({
  code: 200,
  data: { attestation },
  requestId,
  error: '',
});

export default async function verifyAndSendResult(
  req: GithubVerifyParams[0],
  requestId: GithubVerifyParams[1],
  reqPeer: GithubVerifyParams[2],
  callParams: GithubVerifyParams[3]
) {
  let meta: Record<string, any> = {
    req,
    requestId,
    reqPeer,
    callParams,
  };

  logger.info('[sendSignedJWT]: prepare sending a signed JWT', meta);

  if (!req.jws) {
    return await onVerifyResult(
      validationError(requestId, `"jws" is required`),
      reqPeer
    );
  }

  const { payload, did } = await verifyJWS(req.jws);
  if (!payload) {
    return await onVerifyResult(
      permissionError(requestId, `"jws" is invalid`),
      reqPeer
    );
  }

  const challengeCode = payload['challengeCode'];
  if (!challengeCode) {
    return await onVerifyResult(
      permissionError(requestId, `"jws" is invalid`),
      reqPeer
    );
  }

  meta = { ...meta, ...payload };
  const details = await cache.get<Challenge>(challengeKey(did));
  if (!details) {
    logger.debug(`[sendSignedJWT]: no database entry`, meta);

    return await onVerifyResult(
      permissionError(requestId, `"jws" is invalid`),
      reqPeer
    );
  }

  const { username, timestamp, challengeCode: storedChallengeCode } = details;

  if (challengeCode !== storedChallengeCode) {
    logger.debug(`[sendSignedJWT]: challenge code is invalid`, meta);

    return await onVerifyResult(
      permissionError(requestId, `"challengeCode" is invalid`),
      reqPeer
    );
  }

  const startTime = new Date(timestamp);
  const now = new Date();
  const thirtyMinutes = 30 * 60 * 1000;
  if (now.getTime() - startTime.getTime() > thirtyMinutes) {
    logger.debug(`[sendSignedJWT]: challenge code is invalid`, meta);

    return await onVerifyResult(
      permissionError(
        requestId,
        `The challenge must have been generated within the last 30 minutes`
      ),
      reqPeer
    );
  }

  const thirtyMinutesAgo = new Date(
    new Date().setMinutes(new Date().getMinutes() - 30)
  );

  let rawUrl = payload['gistUrl'];
  if (!rawUrl) {
    try {
      const { data: gists } = await client('GET /users/:username/gists', {
        username,
        since: thirtyMinutesAgo.toISOString(),
      });

      if (gists.length > 0) {
        const fileName = Object.keys(gists[0].files)[0];

        rawUrl = gists[0].files[fileName].raw_url;
      }
    } catch (err) {
      logger.debug(`[sendSignedJWT]: cannot find a gist url`, meta);

      await onVerifyResult(
        validationError(requestId, `"gistUrl" is not found`),
        reqPeer
      );

      throw err;
    }
  }

  meta = { ...meta, rawUrl };
  logger.debug(`[sendSignedJWT]: got raw url`, meta);

  let verificationUrl;
  try {
    const res = await fetch(rawUrl);
    const text = await res.text();

    if (text && text.includes(did)) {
      verificationUrl = rawUrl;
    }
  } catch (err) {
    logger.debug(`[sendSignedJWT]: cannot fetch a gist content`, meta);

    await onVerifyResult(
      internalError(requestId, `Internal Server Error`),
      reqPeer
    );

    throw err;
  }

  if (!verificationUrl) {
    return await onVerifyResult(
      permissionError(requestId, `Wrong DID in the gist`),
      reqPeer
    );
  }

  // TODO: sign JWT and send back
}
