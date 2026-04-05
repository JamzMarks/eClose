import { getApiClient } from "@/services/api-client";
import type { IAuthService } from "@/services/auth/auth.service.interface";
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
    return this.client.post<AuthTokensResponse>("/auth/sign-in", credentials);
  }

  signUp(data: SignUpRequest): Promise<AuthTokensResponse> {
    return this.client.post<AuthTokensResponse>("/auth/sign-up", data);
  }

  sendEmailVerification(): Promise<void> {
    return this.client.post<void>("/auth/email-verification/send", {});
  }

  confirmEmailVerification(token: string): Promise<void> {
    return this.client.post<void>("/auth/email-verification/confirm", { token });
  }

  me(): Promise<UserProfileResponse> {
    return this.client.get<UserProfileResponse>("/auth/me");
  }

  submitOnboardingStep(body: OnboardingStepRequest): Promise<OnboardingStepResponse> {
    return this.client.patch<OnboardingStepResponse>("/auth/me/onboarding", body);
  }

  refresh(refreshToken: string): Promise<AuthTokensResponse> {
    return this.client.post<AuthTokensResponse>("/auth/refresh", { refreshToken });
  }

  logout(): Promise<void> {
    return this.client.post<void>("/auth/logout", {});
  }
}
