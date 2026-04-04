import { getApiClient } from "@/infrastructure/api/api-client";
import type { IAuthService } from "@/infrastructure/api/auth/auth.service.interface";
import type {
  AuthTokensResponse,
  OnboardingStepRequest,
  OnboardingStepResponse,
  SignInRequest,
  SignUpRequest,
  UserProfileResponse,
} from "@/infrastructure/api/types/auth.types";

export class AuthService implements IAuthService {
  private readonly client = getApiClient();

  signIn(credentials: SignInRequest): Promise<AuthTokensResponse> {
    return this.client.post<AuthTokensResponse>("/auth/sign-in", credentials);
  }

  signUp(data: SignUpRequest): Promise<AuthTokensResponse> {
    return this.client.post<AuthTokensResponse>("/auth/sign-up", data);
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
