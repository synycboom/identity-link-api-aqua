import { DID } from 'dids';
import KeyResolver from '@ceramicnetwork/key-did-resolver';
import didJWT from 'did-jwt';
import { getResolver } from 'key-did-resolver';
import CeramicClient from '@ceramicnetwork/http-client';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import * as settings from '@/setting';
import { Issue } from '@/claim/type';

const privateKey = settings.ES256K_PRIVATE_KEY_HEX;
const publicKey = settings.ES256K_PUBLIC_KEY_HEX;
const issuerDomain = settings.VERIFICATION_ISSUER_DOMAIN;
// const ceramic = new CeramicClient(settings.CERAMIC_CLIENT_URL);
const resolver = {
  registry: {
    ...getResolver(),
    // ...KeyResolver.getResolver(),
    // ...ThreeIdResolver.getResolver(ceramic),
  },
};

export const verifyJWS = async (jws: string) => {
  const did = new DID({
    resolver: resolver.registry,
  });

  const { kid, payload } = await did.verifyJWS(jws);

  return { kid, payload, did: kid.split(/[#?]/)[0] };
};

export const issue = async ({
  verificationUrl,
  username,
  did,
  type,
  userId,
}: Issue) => {
  if (!username) {
    throw new Error('[issue]: username is required');
  }
  if (!did) {
    throw new Error('[issue]: did is required');
  }
  if (!type) {
    throw new Error('[issue]: no type provided');
  }
  if (!verificationUrl && !userId) {
    throw new Error('[issue]: either verification url or user ID is required');
  }

  const signer = didJWT.ES256KSigner(privateKey);

  return await didJWT.createJWT(
    {
      sub: did,
      nbf: Math.floor(Date.now() / 1000),
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        'type': ['VerifiableCredential'],
        'credentialSubject': {
          account: {
            type,
            username,
            ...(verificationUrl && { url: verificationUrl }),
            ...(userId && { id: userId }),
          },
        },
      },
    },
    {
      issuer: `did:web:${issuerDomain}`,
      signer,
    }
  );
};
