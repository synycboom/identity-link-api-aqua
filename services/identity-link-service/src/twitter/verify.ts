import Twitter from 'twitter';
import { Challenge, TwitterVerifyParams } from '@/twitter/type';
import { onVerifyResult } from '@/_aqua/twitter-requester';
import * as settings from '@/setting';
import * as cache from '@/cache';
import logger from '@/logger';
import { challengeKey } from '@/twitter/util';
import { verifyJWS, issue } from '@/claim';

const twitter = new Twitter({
  consumer_key: settings.TWITTER_CONSUMER_KEY,
  consumer_secret: settings.TWITTER_CONSUMER_SECRET,
  bearer_token: settings.TWITTER_BEARER_TOKEN,
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
  req: TwitterVerifyParams[0],
  requestId: TwitterVerifyParams[1],
  reqPeer: TwitterVerifyParams[2],
  callParams: TwitterVerifyParams[3]
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

  let verificationUrl = payload['tweetUrl'];
  try {
    if (verificationUrl) {
      const tweetId = verificationUrl.split('/').pop();
      const params = {
        id: tweetId,
        tweet_mode: 'extended',
      };

      const tweet = await twitter.get('statuses/show', params);
      if (tweet.full_text.includes(did)) {
        verificationUrl = `https://twitter.com/${username}/status/${tweet.id_str}`;
      }
    } else {
      const params = {
        screen_name: username,
        tweet_mode: 'extended',
        exclude_replies: true,
        include_rts: false,
        count: 5,
      };

      const tweets = (await twitter.get(
        'statuses/user_timeline',
        params
      )) as Array<any>;
      for (let tweet of tweets) {
        if (tweet.full_text.includes(did)) {
          verificationUrl = `https://twitter.com/${username}/status/${tweet.id_str}`;
          break;
        }
      }
    }
  } catch (err) {
    logger.debug(
      `[sendSignedJWT]: got an error while finding a verification url`,
      meta
    );

    await onVerifyResult(
      internalError(requestId, 'Internal Server Error'),
      reqPeer
    );

    throw err;
  }

  if (!verificationUrl) {
    return await onVerifyResult(
      permissionError(
        requestId,
        `"tweetUrl" is not found or does not contain DID`
      ),
      reqPeer
    );
  }

  meta = { ...meta, verificationUrl };
  logger.debug(`[sendSignedJWT]: got verificationUrl`, meta);

  try {
    const attestation = await issue({
      did,
      username,
      verificationUrl,
      type: 'Twitter',
    });

    await onVerifyResult(success(requestId, attestation), reqPeer);
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
