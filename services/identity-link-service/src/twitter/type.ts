import { TwitterIdentityLinkServiceDef } from '@/_aqua/twitter-identity-link-service';

export type TwitterRequestParams = Parameters<
  TwitterIdentityLinkServiceDef['twitterRequest']
>;

export type TwitterVerifyParams = Parameters<
  TwitterIdentityLinkServiceDef['twitterVerify']
>;

export type TwitterRequestReturn = ReturnType<
  TwitterIdentityLinkServiceDef['twitterRequest']
>;

export type TwitterVerifyReturn = ReturnType<
  TwitterIdentityLinkServiceDef['twitterVerify']
>;

export type Challenge = {
  challengeCode: string;
  did: string;
  username: string;
  timestamp: number;
};
