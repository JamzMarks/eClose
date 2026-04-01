import { Injectable, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  IOAuthProviderGateway,
  OAuthAuthorizeRequest,
  OAuthAuthorizeResult,
  OAuthCallbackPayload,
  OAuthExternalIdentity,
} from "../interfaces/oauth-provider-gateway.interface";
import { OAuthProviderId } from "../types/oauth-provider-id.type";

/**
 * Troca `code` → tokens via HTTP (Google / GitHub). Requer secrets em env.
 * URLs de autorização seguem o mesmo contrato do stub.
 */
@Injectable()
export class HttpOAuthProviderGateway implements IOAuthProviderGateway {
  async buildAuthorizationUrl(request: OAuthAuthorizeRequest): Promise<OAuthAuthorizeResult> {
    const state = request.state ?? randomUUID();

    if (request.provider === OAuthProviderId.GOOGLE) {
      const clientId = process.env.OAUTH_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new ServiceUnavailableException(
          "OAuth Google: defina OAUTH_GOOGLE_CLIENT_ID e OAUTH_GOOGLE_CLIENT_SECRET.",
        );
      }
      const redirect = encodeURIComponent(request.redirectUri);
      const scope = encodeURIComponent(
        (request.scopes?.length ? request.scopes : ["openid", "email", "profile"]).join(" "),
      );
      const authorizationUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${redirect}&response_type=code&scope=${scope}` +
        `&state=${encodeURIComponent(state)}&access_type=offline&prompt=consent`;
      return { authorizationUrl, state };
    }

    if (request.provider === OAuthProviderId.GITHUB) {
      const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
      if (!clientId) {
        throw new ServiceUnavailableException(
          "OAuth GitHub: defina OAUTH_GITHUB_CLIENT_ID e OAUTH_GITHUB_CLIENT_SECRET.",
        );
      }
      const redirect = encodeURIComponent(request.redirectUri);
      const scope = encodeURIComponent(request.scopes?.length ? request.scopes.join(" ") : "read:user user:email");
      const authorizationUrl =
        `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${redirect}&state=${encodeURIComponent(state)}&scope=${scope}`;
      return { authorizationUrl, state };
    }

    if (request.provider === OAuthProviderId.APPLE || request.provider === OAuthProviderId.META) {
      throw new ServiceUnavailableException(`OAuth ${request.provider}: não implementado neste gateway.`);
    }

    throw new ServiceUnavailableException("Provedor OAuth não suportado.");
  }

  async exchangeCode(payload: OAuthCallbackPayload): Promise<OAuthExternalIdentity> {
    if (payload.provider === OAuthProviderId.GOOGLE) {
      return this.exchangeGoogle(payload);
    }
    if (payload.provider === OAuthProviderId.GITHUB) {
      return this.exchangeGitHub(payload);
    }
    throw new ServiceUnavailableException("Troca de código não suportada para este provedor.");
  }

  private async exchangeGoogle(payload: OAuthCallbackPayload): Promise<OAuthExternalIdentity> {
    const clientId = process.env.OAUTH_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.OAUTH_GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new ServiceUnavailableException("Defina OAUTH_GOOGLE_CLIENT_ID e OAUTH_GOOGLE_CLIENT_SECRET.");
    }
    const body = new URLSearchParams({
      code: payload.code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: payload.redirectUri,
      grant_type: "authorization_code",
    });
    if (payload.codeVerifier) {
      body.set("code_verifier", payload.codeVerifier);
    }
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      throw new UnauthorizedException(`Google token exchange falhou: ${t}`);
    }
    const tokens = (await tokenRes.json()) as { access_token?: string };
    if (!tokens.access_token) {
      throw new UnauthorizedException("Google não retornou access_token.");
    }
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!userRes.ok) {
      const t = await userRes.text();
      throw new UnauthorizedException(`Google userinfo falhou: ${t}`);
    }
    const profile = (await userRes.json()) as {
      id?: string;
      email?: string;
      verified_email?: boolean;
      name?: string;
      picture?: string;
    };
    if (!profile.id) {
      throw new UnauthorizedException("Perfil Google sem id.");
    }
    return {
      provider: OAuthProviderId.GOOGLE,
      providerAccountId: profile.id,
      email: profile.email,
      emailVerified: profile.verified_email,
      name: profile.name,
      picture: profile.picture,
    };
  }

  private async exchangeGitHub(payload: OAuthCallbackPayload): Promise<OAuthExternalIdentity> {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new ServiceUnavailableException("Defina OAUTH_GITHUB_CLIENT_ID e OAUTH_GITHUB_CLIENT_SECRET.");
    }
    const body = JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: payload.code,
      redirect_uri: payload.redirectUri,
    });
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    });
    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      throw new UnauthorizedException(`GitHub token exchange falhou: ${t}`);
    }
    const tokens = (await tokenRes.json()) as { access_token?: string; error?: string };
    if (tokens.error || !tokens.access_token) {
      throw new UnauthorizedException(tokens.error ?? "GitHub não retornou access_token.");
    }
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (!userRes.ok) {
      const t = await userRes.text();
      throw new UnauthorizedException(`GitHub user falhou: ${t}`);
    }
    const profile = (await userRes.json()) as { id?: number; email?: string | null; name?: string | null };
    let email = profile.email ?? undefined;
    if (!email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          Accept: "application/vnd.github+json",
        },
      });
      if (emailsRes.ok) {
        const list = (await emailsRes.json()) as { email?: string; primary?: boolean; verified?: boolean }[];
        email = list.find((e) => e.primary && e.verified)?.email ?? list.find((e) => e.verified)?.email;
      }
    }
    if (profile.id == null) {
      throw new UnauthorizedException("Perfil GitHub sem id.");
    }
    return {
      provider: OAuthProviderId.GITHUB,
      providerAccountId: String(profile.id),
      email,
      name: profile.name ?? undefined,
    };
  }
}
