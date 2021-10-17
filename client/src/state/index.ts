import { atom } from 'recoil';

export interface IAccountState {
  connected: boolean;
  address: string;
  did: any;
}

export const defaultAccountState: IAccountState = {
  connected: false,
  address: '',
  did: null,
};

export const accountState = atom({
  key: 'accountState',
  default: defaultAccountState,
});
