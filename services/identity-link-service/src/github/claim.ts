import { DID } from 'dids';
import KeyResolver from '@ceramicnetwork/key-did-resolver';

const resolver = {
  registry: {
    ...KeyResolver.getResolver(),
  },
};

export const verifyJWS = async (jws: string) => {
  const did = new DID({
    resolver: resolver.registry,
  });

  const { kid, payload } = await did.verifyJWS(jws);

  return { kid, payload, did: kid.split(/[#?]/)[0] };
};
