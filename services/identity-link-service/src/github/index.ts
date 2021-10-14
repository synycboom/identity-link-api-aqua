import { request } from '@octokit/request';
import { randomString } from '@stablelib/random';
import { registerGithubIdentityLinkService } from '@/_aqua/github-identity-link-service';
import { sendGithubRequestResult } from '@/_aqua/github-requester';
import * as settings from '@/setting';
import {
  GithubRequestParams,
  GithubRequestReturn,
  GithubVerifyParams,
  GithubVerifyReturn,
} from '@/github/type';
import * as cache from '@/cache';
import logger from '@/logger';
import { isErrorObject } from '@/type';

const token = settings.GITHUB_PERSONAL_ACCESS_TOKEN;
if (!token) {
  throw new Error('[register]: no personal access token');
}

const client = request.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

const challengeKey = (did: string) => `${did}:github`;

const sendChallenge = async (
  req: GithubRequestParams[0],
  reqPeer: GithubRequestParams[1],
  callParams: GithubRequestParams[2]
) => {
  logger.info('send result', {
    req,
    callParams,
  });
  const challengeCode = randomString(32);
  const { did, username } = req;
  const data = {
    did,
    username,
    timestamp: Date.now(),
    challengeCode,
  };
  const meta = {
    did,
    username,
    ...callParams,
  };
  const res = {
    code: 0,
    data: {
      challengeCode: '',
    },
    error: '',
  };

  try {
    if (!username) {
      res.code = 400;
      res.error = `"username" is required`;

      return await sendGithubRequestResult(
        res,
        reqPeer.peerId,
        reqPeer.relayPeerId,
        !!reqPeer.relayPeerId
      );
    }

    if (!did) {
      res.code = 400;
      res.error = `"did" is required`;

      return await sendGithubRequestResult(
        res,
        reqPeer.peerId,
        reqPeer.relayPeerId,
        !!reqPeer.relayPeerId
      );
    }

    await cache.set(challengeKey(did), data);
    res.code = 200;
    res.data.challengeCode = challengeCode;
  } catch (err) {
    if (isErrorObject(err)) {
      logger.error(`[githubRequest]: cannot set data to cache`, {
        ...meta,
        error: err.message,
      });
    }

    res.code = 500;
    res.error = 'Internal Server Error';
    logger.error(`[githubRequest]: unknown error; ${err}`, meta);
  }

  return await sendGithubRequestResult(
    res,
    reqPeer.peerId,
    reqPeer.relayPeerId,
    !!reqPeer.relayPeerId
  );
};

export default function register() {
  registerGithubIdentityLinkService({
    githubRequest(
      req: GithubRequestParams[0],
      reqPeer: GithubRequestParams[1],
      callParams: GithubRequestParams[2]
    ) {
      sendChallenge(req, reqPeer, callParams);
    },
    githubVerify(
      req: GithubVerifyParams[0],
      reqPeer: GithubVerifyParams[1],
      callParams: GithubRequestParams[2]
    ) {
      logger.debug('githubVerify');
    },
  });
}
