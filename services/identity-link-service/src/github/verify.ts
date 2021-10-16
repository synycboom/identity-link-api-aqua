import { request } from '@octokit/request';
import { Challenge, GithubVerifyParams } from '@/github/type';
import { onVerifyResult } from '@/_aqua/github-requester';
import * as settings from '@/setting';
import * as cache from '@/cache';
import logger from '@/logger';
import { challengeKey } from '@/github/util';
import { verifyJWS, issue } from '@/claim';
import got from 'got';

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
    requestId,
    reqPeer,
  };

  logger.info('[sendSignedJWT]: prepare sending a signed JWT', meta);

  if (!req.jws) {
    return await onVerifyResult(
      validationError(requestId, `"jws" is required`),
      reqPeer
    );
  }

  let did = '';
  let payload: Record<string, any> | undefined;
  try {
    const res = await verifyJWS(req.jws);
    did = res.did;
    payload = res.payload;
  } catch (err) {
    logger.debug(`[sendSignedJWT]: cannot verify JWS`, {
      ...meta,
      err,
    });

    return await onVerifyResult(
      permissionError(requestId, `"jws" is invalid`),
      reqPeer
    );
  }

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

  logger.debug(`[sendSignedJWT]: got JWS payload`, { ...meta, ...payload });
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
      logger.debug(`[sendSignedJWT]: got an error while finding a gist url`, meta);

      await onVerifyResult(
        internalError(requestId, 'Internal Server Error'),
        reqPeer
      );

      throw err;
    }
  }
  if (!rawUrl) {
      await onVerifyResult(
        permissionError(requestId, `"gistUrl" is not found`),
        reqPeer
      );
  }

  meta = { ...meta, rawUrl };
  logger.debug(`[sendSignedJWT]: got raw url`, meta);

  let verificationUrl = '';
  try {
    const { body } = await got.get(rawUrl);

    if (body && body.includes(did)) {
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

  try {
    const attestation = await issue({
      did,
      username,
      verificationUrl,
      type: 'Github',
    });

    await onVerifyResult(
      success(requestId, attestation),
      reqPeer
    );
  } catch (err) {
    logger.debug(`[sendSignedJWT]: cannot issue attestation`, meta);

    await onVerifyResult(
      internalError(requestId, 'Internal Server Error'),
      reqPeer
    );

    throw err;
  }

  logger.info('[sendSignedJWT]: done sending a signed JWT', meta);
}
