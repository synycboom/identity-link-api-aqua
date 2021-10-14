import { GithubIdentityLinkServiceDef } from '@/github/fluence';

export type GithubRequestParams = Parameters<
  GithubIdentityLinkServiceDef['githubRequest']
>;

export type GithubVerifyParams = Parameters<
  GithubIdentityLinkServiceDef['githubVerify']
>;

export type GithubRequestReturn = ReturnType<
  GithubIdentityLinkServiceDef['githubRequest']
>;

export type GithubVerifyReturn = ReturnType<
  GithubIdentityLinkServiceDef['githubVerify']
>;
