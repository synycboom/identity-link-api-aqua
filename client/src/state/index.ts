import { DID } from 'dids';
import { atom } from 'recoil';

export interface IAccountState {
  connected: boolean;
  address: string;
  did?: DID;
}

export const defaultAccountState: IAccountState = {
  connected: false,
  address: '',
  did: undefined,
};

export const accountState = atom({
  key: 'accountState',
  default: defaultAccountState,
});
