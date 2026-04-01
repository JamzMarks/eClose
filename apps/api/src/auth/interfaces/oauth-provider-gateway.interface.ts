import { OAuthProviderId } from "../types/oauth-provider-id.type";

export type OAuthAuthorizeRequest = {
  provider: OAuthProviderId;
  redirectUri: string;
  state?: string;
  scopes?: string[];
};

export type OAuthAuthorizeResult = {
  authorizationUrl: string;
  state: string;
  /** PKCE: devolvido ao cliente para enviar no callback quando a infra estiver ativa */
  codeVerifier?: string;
};

export type OAuthCallbackPayload = {
  provider: OAuthProviderId;
  code: string;
  redirectUri: string;
  codeVerifier?: string;
  state?: string;
};

export type OAuthExternalIdentity = {
  provider: OAuthProviderId;
  providerAccountId: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  picture?: string;
};

/**
 * Porta para provedores OAuth. Implementações reais ficam em infra (HTTP, secrets, PKCE).
 */
export interface IOAuthProviderGateway {
  buildAuthorizationUrl(request: OAuthAuthorizeRequest): Promise<OAuthAuthorizeResult>;
  exchangeCode(payload: OAuthCallbackPayload): Promise<OAuthExternalIdentity>;
}
