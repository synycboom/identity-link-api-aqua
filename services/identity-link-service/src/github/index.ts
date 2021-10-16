import { registerGithubIdentityLinkService } from '@/_aqua/github-identity-link-service';
import verifyAndSendResult from '@/github/verify';
import sendChallenge from '@/github/request';
import { isErrorObject } from '@/type';
import logger from '@/logger';

export default function register() {
  registerGithubIdentityLinkService({
    async githubRequest(req, requestId, reqPeer, callParams) {
      const meta = {
        req,
        requestId,
        reqPeer,
      };

      try {
        await sendChallenge(req, requestId, reqPeer, callParams);
      } catch (err) {
        if (isErrorObject(err)) {
          logger.error(`[githubRequest]: cannot set data to cache`, {
            ...meta,
            error: err.message,
          });
        } else {
          logger.error(`[githubRequest]: unknown error; ${err}`, meta);
        }
      }
    },
    async githubVerify(req, requestId, reqPeer, callParams) {
      const meta: Record<string, any> = {
        req,
        requestId,
        reqPeer,
      };

      try {
        await verifyAndSendResult(req, requestId, reqPeer, callParams);
      } catch (err) {
        if (isErrorObject(err)) {
          logger.error(`[githubVerify]: cannot verify`, {
            ...meta,
            error: err.message,
          });
        } else {
          logger.error(`[githubRequest]: unknown error; ${err}`, meta);
        }
      }
    },
  });
}
