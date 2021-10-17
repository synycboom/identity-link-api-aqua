import { registerTwitterIdentityLinkService } from '@/_aqua/twitter-identity-link-service';
import verifyAndSendResult from '@/twitter/verify';
import sendChallenge from '@/twitter/request';
import { isErrorObject } from '@/type';
import logger from '@/logger';

export default function register() {
  registerTwitterIdentityLinkService({
    async twitterRequest(req, requestId, reqPeer, callParams) {
      const meta = {
        req,
        requestId,
        reqPeer,
      };

      try {
        await sendChallenge(req, requestId, reqPeer, callParams);
      } catch (err) {
        if (isErrorObject(err)) {
          logger.error(`[twitterRequest]: cannot set data to cache`, {
            ...meta,
            error: err.message,
          });
        } else {
          logger.error(`[twitterRequest]: unknown error; ${err}`, meta);
        }
      }
    },
    async twitterVerify(req, requestId, reqPeer, callParams) {
      const meta: Record<string, any> = {
        req,
        requestId,
        reqPeer,
      };

      try {
        await verifyAndSendResult(req, requestId, reqPeer, callParams);
      } catch (err) {
        if (isErrorObject(err)) {
          logger.error(`[twitterVerify]: cannot verify`, {
            ...meta,
            error: err.message,
          });
        } else {
          logger.error(`[twitterVerify]: unknown error; ${err}`, meta);
        }
      }
    },
  });
}
