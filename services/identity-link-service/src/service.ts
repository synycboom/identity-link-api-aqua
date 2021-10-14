import logger from '@/logger';
import {
  registerIdentityLinkService,
  IdentityLinkServiceDef,
} from '@/_aqua/identity-link-service';

type GithubRequestParams = Parameters<IdentityLinkServiceDef['githubRequest']>;
type GithubVerifyParams = Parameters<IdentityLinkServiceDef['githubVerify']>;

type GithubRequestReturn = ReturnType<IdentityLinkServiceDef['githubRequest']>;
type GithubVerifyReturn = ReturnType<IdentityLinkServiceDef['githubVerify']>;

class IdentityLinkService implements IdentityLinkServiceDef {
  githubRequest(
    req: GithubRequestParams[0],
    callParams: GithubRequestParams[1]
  ): GithubRequestReturn {
    return {
      code: 200,
      data: {
        challengeCode: '',
      },
      error: '',
    };
  }
  githubVerify(
    req: GithubVerifyParams[0],
    callParams: GithubVerifyParams[1]
  ): GithubVerifyReturn {
    return {
      code: 200,
      data: {
        attestation: '',
      },
    };
  }
}

export const registerService = async () => {
  registerIdentityLinkService(new IdentityLinkService());
  logger.info('[registerService]: registered the service');
};
