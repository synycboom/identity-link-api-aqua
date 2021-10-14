import { request } from '@octokit/request';
import { randomString } from '@stablelib/random';
import { registerGithubIdentityLinkService } from '@/github/fluence';
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

const githubRequest = async (
  req: GithubRequestParams[0],
  callParams: GithubRequestParams[1]
): GithubRequestReturn => {
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

  if (!username) {
    res.code = 400;
    res.error = `"username" is required`;

    return res;
  }

  if (!did) {
    res.code = 400;
    res.error = `"did" is required`;

    return res;
  }

  try {
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

  return res;
};

const githubVerify = async (
  req: GithubVerifyParams[0],
  callParams: GithubVerifyParams[1]
): GithubVerifyReturn => {
  return {
    code: 200,
    data: {
      attestation: '',
    },
  };
};

export default function register() {
  registerGithubIdentityLinkService({
    githubRequest,
    githubVerify,
  });
}
