import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import Ceramic from '@ceramicnetwork/http-client';
import { DID } from 'dids';
import setting from 'src/setting';
import { provider } from 'web3-core';

export const getOrCreateDid = async (
  address: string,
  ethProvider: provider
): Promise<DID> => {
  const authProvider = new EthereumAuthProvider(ethProvider, address);
  const threeIdConnect = new ThreeIdConnect();

  await threeIdConnect.connect(authProvider);
  const ceramic = new Ceramic(setting.REACT_APP_CERAMIC_URL);
  const didProvider = threeIdConnect.getDidProvider();
  const resolver = ThreeIdResolver.getResolver(ceramic);
  const did = new DID({
    provider: didProvider,
    resolver,
  });
  await did.authenticate();
  return did;
};
