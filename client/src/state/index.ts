import { DID } from 'dids';
import { atom, RecoilState, selector } from 'recoil';
import jwt_decode from 'jwt-decode';

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

export const defaultSocialJWTState: StreamSocialAccount = {
  github: '',
  twitter: '',
};
export interface StreamSocialAccount {
  github: string;
  twitter: string;
}
export const socialJWTState = atom({
  key: 'socialJWTState',
  default: defaultSocialJWTState,
});

export interface ISocialAccount {
  type: string;
  username: string;
  url: string;
}
const getDataFromJWT = (jwt: string): ISocialAccount => {
  const {
    vc: {
      credentialSubject: { account },
    },
  }: any = jwt_decode(jwt);
  return account;
};
export const socialDataState = selector({
  key: 'socialDataState',
  get: ({ get }) => {
    const social = get(socialJWTState);
    return {
      github: social.github ? getDataFromJWT(social.github) : null,
      twitter: social.twitter ? getDataFromJWT(social.twitter) : null,
    };
  },
});
