import { DID } from 'dids';
import { atom, RecoilState } from 'recoil';

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

export type IRequestState = Array<{
  id: string;
  data: any;
}>;
const defaultRequestState: IRequestState = [];
export const requestState: RecoilState<IRequestState> = atom({
  key: 'requestState',
  default: defaultRequestState,
});
