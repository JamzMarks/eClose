import { getApiClient } from "@/services/api-client";
import type { IAuthService } from "@/services/auth/auth.service.interface";
import { USE_API_MOCKS } from "@/services/config/api-mocks";
import type {
  AuthTokensResponse,
  OnboardingStepRequest,
  OnboardingStepResponse,
  SignInRequest,
  SignUpRequest,
  UserProfileResponse,
} from "@/services/types/auth.types";

export class AuthService implements IAuthService {
  private readonly client = getApiClient();

  signIn(credentials: SignInRequest): Promise<AuthTokensResponse> {
    if (USE_API_MOCKS) {
      return Promise.resolve({
        accessToken: "mock_access_token",
        refreshToken: "mock_refresh_token",
        tokenType: "Bearer",
        expiresIn: 60 * 60,
      });
    }

    // return this.client.post<AuthTokensResponse>("/auth/sign-in", credentials);
    return this.client.post<AuthTokensResponse>("/auth/sign-in", credentials);
  }

  signUp(data: SignUpRequest): Promise<AuthTokensResponse> {
    if (USE_API_MOCKS) {
      return Promise.resolve({
        accessToken: "mock_access_token",
        refreshToken: "mock_refresh_token",
        tokenType: "Bearer",
        expiresIn: 60 * 60,
      });
    }

    // return this.client.post<AuthTokensResponse>("/auth/sign-up", data);
    return this.client.post<AuthTokensResponse>("/auth/sign-up", data);
  }

  sendEmailVerification(): Promise<void> {
    if (USE_API_MOCKS) {
      return Promise.resolve();
    }

    // return this.client.post<void>("/auth/email-verification/send", {});
    return this.client.post<void>("/auth/email-verification/send", {});
  }

  confirmEmailVerification(token: string): Promise<void> {
    if (USE_API_MOCKS) {
      return Promise.resolve();
    }

    // return this.client.post<void>("/auth/email-verification/confirm", { token });
    return this.client.post<void>("/auth/email-verification/confirm", { token });
  }

  me(): Promise<UserProfileResponse> {
    if (USE_API_MOCKS) {
      return Promise.resolve({
        id: "user_mock_1",
        email: "mock@eclose.app",
        username: "mock_user",
        firstName: "Mock",
        lastName: "User",
        profileNamesAcknowledgedAt: new Date().toISOString(),
        emailVerifiedAt: new Date().toISOString(),
        needsEmailVerification: false,
        needsProfileNames: false,
        needsEventInterests: false,
        profileCompletion: "full",
      });
    }

    // return this.client.get<UserProfileResponse>("/auth/me");
    return this.client.get<UserProfileResponse>("/auth/me");
  }

  submitOnboardingStep(body: OnboardingStepRequest): Promise<OnboardingStepResponse> {
    if (USE_API_MOCKS) {
      if (body.step === "names") {
        return Promise.resolve({ step: "names" });
      }
      if (body.step === "notification_preferences") {
        return Promise.resolve({
          step: "notification_preferences",
          preferences: {
            email: body.email ?? true,
            push: body.push ?? true,
            sms: body.sms ?? false,
          },
        });
      }
      return Promise.resolve({
        step: "event_interests",
        eventInterests: body.eventInterests ?? [],
      });
    }

    // return this.client.patch<OnboardingStepResponse>("/auth/me/onboarding", body);
    return this.client.patch<OnboardingStepResponse>("/auth/me/onboarding", body);
  }

  refresh(refreshToken: string): Promise<AuthTokensResponse> {
    if (USE_API_MOCKS) {
      return Promise.resolve({
        accessToken: "mock_access_token_refreshed",
        refreshToken: refreshToken || "mock_refresh_token",
        tokenType: "Bearer",
        expiresIn: 60 * 60,
      });
    }

    // return this.client.post<AuthTokensResponse>("/auth/refresh", { refreshToken });
    return this.client.post<AuthTokensResponse>("/auth/refresh", { refreshToken });
  }

  logout(): Promise<void> {
    if (USE_API_MOCKS) {
      return Promise.resolve();
    }

    // return this.client.post<void>("/auth/logout", {});
    return this.client.post<void>("/auth/logout", {});
  }
}
