import type {
  DIDResolutionResult,
  DIDResolutionOptions,
  DIDDocument,
  DIDDocumentMetadata,
  ParsedDID,
  Resolver,
  ResolverRegistry,
} from 'did-resolver';

import { getDIDDocument } from 'src/_aqua/did-document-service';

type IdentityLinkDIDResolverConfig = {
  routerPeerId: string;
  routerServiceId: string;
  identityLinkDIDServiceId: string;
};

const DID_LD_JSON = 'application/did+ld+json';
const DID_JSON = 'application/did+json';

async function resolve(
  did: string,
  config: IdentityLinkDIDResolverConfig
): Promise<DIDResolutionResult> {
  const metadata: DIDDocumentMetadata = {};
  const router = {
    routerPeerId: config.routerPeerId,
    routerServiceId: config.routerServiceId,
    identityLinkDIDServiceId: config.identityLinkDIDServiceId,
  };
  const didDocString = await new Promise<string>((res, rej) => {
    getDIDDocument(
      router,
      did,
      (msg) => res(msg),
      (code, msg) => rej(`code: ${code}, msg: ${msg}`)
    );
  });

  return {
    didResolutionMetadata: { contentType: DID_JSON },
    didDocument: JSON.parse(didDocString) as DIDDocument,
    didDocumentMetadata: metadata,
  };
}

function validateResolverConfig(config: IdentityLinkDIDResolverConfig) {
  if (!config.routerPeerId) {
    throw new Error('Missing Fluence routerPeerId config');
  }
  if (!config.routerServiceId) {
    throw new Error('Missing Fluence routerServiceId config');
  }
  if (!config.identityLinkDIDServiceId) {
    throw new Error('Missing identityLinkDIDServiceId config');
  }
}

export default {
  getResolver: (config: IdentityLinkDIDResolverConfig): ResolverRegistry => {
    validateResolverConfig(config);

    return {
      identity_link: async (
        did: string,
        parsed: ParsedDID,
        resolver: Resolver,
        options: DIDResolutionOptions
      ): Promise<DIDResolutionResult> => {
        const contentType = options.accept || DID_JSON;

        try {
          const didResult = await resolve(did, config);

          if (contentType === DID_LD_JSON) {
            didResult.didDocument!['@context'] = 'https://w3id.org/did/v1';
            didResult.didResolutionMetadata.contentType = DID_LD_JSON;
          } else if (contentType !== DID_JSON) {
            didResult.didDocument = null;
            didResult.didDocumentMetadata = {};
            delete didResult.didResolutionMetadata.contentType;
            didResult.didResolutionMetadata.error =
              'representationNotSupported';
          }
          return didResult;
        } catch (e: any) {
          return {
            didResolutionMetadata: {
              error: 'invalidDid',
              message: e.toString(),
            },
            didDocument: null,
            didDocumentMetadata: {},
          };
        }
      },
    };
  },
};
