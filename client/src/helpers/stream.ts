import setting from 'src/setting';
import Ceramic from '@ceramicnetwork/http-client';
import { DID } from 'dids';
import { IDX } from '@ceramicstudio/idx';
import { defaultSocialJWTState, StreamSocialAccount } from 'src/state';

export const setStream = async (
  did: DID,
  payload: Record<string, string>
): Promise<void> => {
  const ceramic = new Ceramic(setting.REACT_APP_CERAMIC_URL);
  ceramic.did = did;

  const idx = new IDX({ ceramic });
  await idx.set('basicProfile', payload);
};

export const getStream = async (did: DID): Promise<StreamSocialAccount> => {
  const ceramic = new Ceramic(setting.REACT_APP_CERAMIC_URL);
  ceramic.did = did;
  const idx = new IDX({ ceramic });
  const res = await idx.get<StreamSocialAccount>('basicProfile');
  return res || defaultSocialJWTState;
};
