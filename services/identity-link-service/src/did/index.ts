import { registerIdentityLinkDIDService } from '@/_aqua/did-document-service';
import * as settings from '@/setting';
import logger from '@/logger';

const publicKeyHex = settings.ES256K_PUBLIC_KEY_HEX;
const issuer = settings.VERIFICATION_ISSUER_DOMAIN;

export default function register() {
  registerIdentityLinkDIDService({
    async getDIDDocument(did, callParams) {
      logger.info('got a new did request', {
        did: did,
      });

      const id = `did:identity_link:${issuer}`;
      if (did !== id) {
        return {
          code: 404,
          data: '',
          error: 'did is not found',
        };
      }

      const document = {
        '@context': 'https://w3id.org/did/v1',
        id,
        'publicKey': [
          {
            id: `did:p2p:${issuer}#owner`,
            type: 'Secp256k1VerificationKey2018',
            owner: `did:identity_link:${issuer}`,
            publicKeyHex: publicKeyHex,
          },
        ],
        'authentication': [
          {
            type: 'Secp256k1SignatureAuthentication2018',
            publicKey: `did:identity_link:${issuer}#owner`,
          },
        ],
      };

      return {
        code: 200,
        data: JSON.stringify(document),
        error: '',
      };
    },
  });
}
