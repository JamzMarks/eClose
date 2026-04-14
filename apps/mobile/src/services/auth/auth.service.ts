import { getApiClient } from "@/services/api-client";
import {
  LOCAL_AUTH_TOKENS,
  LOCAL_USER_PROFILE,
  localOnboardingStepResponse,
  localRefreshTokens,
} from "@/services/auth/auth.local-data";
import { USE_LOCAL_SERVICE_DATA } from "@/services/config/service-data-source";
import type { IAuthService, OAuthStartBody } from "@/services/auth/auth.service.interface";
import type {
  AuthTokensResponse,
  OAuthCallbackRequest,
  OAuthStartResponse,
  OnboardingStepRequest,
  OnboardingStepResponse,
  SignInRequest,
  SignUpRequest,
  UserProfileResponse,
} from "@/services/types/auth.types";

export class AuthService implements IAuthService {
  private readonly client = getApiClient();

  signIn(_credentials: SignInRequest): Promise<AuthTokensResponse> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve(LOCAL_AUTH_TOKENS);
    }
    return this.client.post<AuthTokensResponse>("/auth/sign-in", _credentials);
  }

  signUp(_data: SignUpRequest): Promise<AuthTokensResponse> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve(LOCAL_AUTH_TOKENS);
    }
    return this.client.post<AuthTokensResponse>("/auth/sign-up", _data);
  }

  oauthStart(_body: OAuthStartBody): Promise<OAuthStartResponse> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.reject(new Error("OAUTH_LOCAL"));
    }
    return this.client.post<OAuthStartResponse>("/auth/oauth/start", _body);
  }

  oauthCallback(_body: OAuthCallbackRequest): Promise<AuthTokensResponse> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.reject(new Error("OAUTH_LOCAL"));
    }
    return this.client.post<AuthTokensResponse>("/auth/oauth/callback", _body);
  }

  sendEmailVerification(): Promise<void> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve();
    }
    return this.client.post<void>("/auth/email-verification/send", {});
  }

  confirmEmailVerification(_token: string): Promise<void> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve();
    }
    return this.client.post<void>("/auth/email-verification/confirm", { token: _token });
  }

  me(): Promise<UserProfileResponse> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve(LOCAL_USER_PROFILE);
    }
    return this.client.get<UserProfileResponse>("/auth/me");
  }

  submitOnboardingStep(body: OnboardingStepRequest): Promise<OnboardingStepResponse> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve(localOnboardingStepResponse(body));
    }
    return this.client.patch<OnboardingStepResponse>("/auth/me/onboarding", body);
  }

  refresh(refreshToken: string): Promise<AuthTokensResponse> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve(localRefreshTokens(refreshToken));
    }
    return this.client.post<AuthTokensResponse>("/auth/refresh", { refreshToken });
  }

  logout(): Promise<void> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve();
    }
    return this.client.post<void>("/auth/logout", {});
  }
}
