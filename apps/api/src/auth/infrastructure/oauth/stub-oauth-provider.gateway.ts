import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  IOAuthProviderGateway,
  OAuthAuthorizeRequest,
  OAuthAuthorizeResult,
  OAuthCallbackPayload,
  OAuthExternalIdentity,
} from "@/auth/application/ports/oauth-provider-gateway.interface";
import { OAuthProviderId } from "@/auth/domain/types/oauth-provider-id.type";

/**
 * MVP: monta URL de autorização quando variáveis de ambiente existem;
 * a troca `code` → tokens/perfil exige implementação HTTP (fora do escopo atual).
 */
@Injectable()
export class StubOAuthProviderGateway implements IOAuthProviderGateway {
  async buildAuthorizationUrl(request: OAuthAuthorizeRequest): Promise<OAuthAuthorizeResult> {
    const state = request.state ?? randomUUID();

    if (request.provider === OAuthProviderId.GOOGLE) {
      const clientId = process.env.OAUTH_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new ServiceUnavailableException(
          "OAuth Google: defina OAUTH_GOOGLE_CLIENT_ID (e depois implemente exchangeCode na infra).",
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

    if (request.provider === OAuthProviderId.APPLE) {
      throw new ServiceUnavailableException(
        "OAuth Apple: configure client id/service id e implementação na infra.",
      );
    }

    if (request.provider === OAuthProviderId.META) {
      throw new ServiceUnavailableException(
        "OAuth Meta: configure app Meta e implementação na infra.",
      );
    }

    throw new ServiceUnavailableException("Provedor OAuth não suportado.");
  }

  async exchangeCode(_payload: OAuthCallbackPayload): Promise<OAuthExternalIdentity> {
    throw new ServiceUnavailableException(
      "Troca de código OAuth ainda não implementada: adicione um HttpOAuthProviderGateway (token endpoint + userinfo).",
    );
  }
}
