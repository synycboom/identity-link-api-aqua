import { GithubIdentityLinkServiceDef } from '@/_aqua/github-identity-link-service';

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
