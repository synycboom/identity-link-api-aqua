import { Fluence, FluencePeer } from '@fluencelabs/fluence';
import {
  ResultCodes,
  CallParams,
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v1';

function missingFields(obj: any, fields: string[]): string[] {
  return fields.filter(f => !(f in obj));
}

export interface GithubIdentityLinkServiceDef {
  githubRequest: (
    req: { did: string; username: string },
    callParams: CallParams<'req'>
  ) => Promise<{
    code: number;
    data: { challengeCode: string };
    error: string;
  }>;
  githubVerify: (
    req: { did: string; username: string },
    callParams: CallParams<'req'>
  ) => Promise<{ code: number; data: { attestation: string } }>;
}
export function registerGithubIdentityLinkService(
  service: GithubIdentityLinkServiceDef
): void;
export function registerGithubIdentityLinkService(
  serviceId: string,
  service: GithubIdentityLinkServiceDef
): void;
export function registerGithubIdentityLinkService(
  peer: FluencePeer,
  service: GithubIdentityLinkServiceDef
): void;
export function registerGithubIdentityLinkService(
  peer: FluencePeer,
  serviceId: string,
  service: GithubIdentityLinkServiceDef
): void;

export function registerGithubIdentityLinkService(...args: any) {
  let peer: FluencePeer;
  let serviceId: any;
  let service: any;
  if (FluencePeer.isInstance(args[0])) {
    peer = args[0];
  } else {
    peer = Fluence.getPeer();
  }

  if (typeof args[0] === 'string') {
    serviceId = args[0];
  } else if (typeof args[1] === 'string') {
    serviceId = args[1];
  } else {
    serviceId = 'github-identity-link-service';
  }

  // Figuring out which overload is the service.
  // If the first argument is not Fluence Peer and it is an object, then it can only be the service def
  // If the first argument is peer, we are checking further. The second argument might either be
  // an object, that it must be the service object
  // or a string, which is the service id. In that case the service is the third argument
  if (!FluencePeer.isInstance(args[0]) && typeof args[0] === 'object') {
    service = args[0];
  } else if (typeof args[1] === 'object') {
    service = args[1];
  } else {
    service = args[2];
  }

  const incorrectServiceDefinitions = missingFields(service, [
    'githubRequest',
    'githubVerify',
  ]);
  if (incorrectServiceDefinitions.length) {
    throw new Error(
      'Error registering service GithubIdentityLinkService: missing functions: ' +
        incorrectServiceDefinitions.map(d => "'" + d + "'").join(', ')
    );
  }

  peer.internals.callServiceHandler.use(async (req, resp, next) => {
    if (req.serviceId !== serviceId) {
      next();
      return;
    }

    if (req.fnName === 'githubRequest') {
      const callParams = {
        ...req.particleContext,
        tetraplets: {
          req: req.tetraplets[0],
        },
      };
      resp.retCode = ResultCodes.success;
      resp.result = await service.githubRequest(req.args[0], callParams);
    }

    if (req.fnName === 'githubVerify') {
      const callParams = {
        ...req.particleContext,
        tetraplets: {
          req: req.tetraplets[0],
        },
      };
      resp.retCode = ResultCodes.success;
      resp.result = await service.githubVerify(req.args[0], callParams);
    }

    next();
  });
}

// Functions
