import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import type { IAuthService } from "@/services/auth/auth.service.interface";
import type { AuthTokensResponse, OAuthProviderId } from "@/services/types/auth.types";

export function getOAuthRedirectUri(): string {
  return AuthSession.makeRedirectUri({
    path: "oauth-callback",
  });
}

function queryParam(url: string, key: string): string | null {
  const parsed = Linking.parse(url);
  const raw = parsed.queryParams?.[key];
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw) && typeof raw[0] === "string") return raw[0];
  return null;
}

/**
 * Abre o browser de sistema para o fluxo OAuth e conclui com `POST /auth/oauth/callback`.
 */
export async function runOAuthBrowserFlow(
  auth: Pick<IAuthService, "oauthStart" | "oauthCallback">,
  provider: OAuthProviderId,
): Promise<AuthTokensResponse> {
  const redirectUri = getOAuthRedirectUri();
  const start = await auth.oauthStart({ provider, redirectUri });
  const result = await WebBrowser.openAuthSessionAsync(start.authorizationUrl, redirectUri);

  if (result.type !== "success" || !result.url) {
    throw new Error("OAUTH_CANCELLED");
  }

  const code = queryParam(result.url, "code");
  if (!code) {
    throw new Error("OAUTH_NO_CODE");
  }

  return auth.oauthCallback({
    provider,
    code,
    redirectUri,
    codeVerifier: start.codeVerifier,
    state: start.state,
  });
}
