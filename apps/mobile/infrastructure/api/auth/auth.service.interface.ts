import type {
  AuthTokensResponse,
  OnboardingStepRequest,
  OnboardingStepResponse,
  SignInRequest,
  SignUpRequest,
  UserProfileResponse,
} from "@/infrastructure/api/types/auth.types";

export interface IAuthService {
  signIn(credentials: SignInRequest): Promise<AuthTokensResponse>;
  signUp(data: SignUpRequest): Promise<AuthTokensResponse>;
  sendEmailVerification(): Promise<void>;
  confirmEmailVerification(token: string): Promise<void>;
  me(): Promise<UserProfileResponse>;
  submitOnboardingStep(body: OnboardingStepRequest): Promise<OnboardingStepResponse>;
  refresh(refreshToken: string): Promise<AuthTokensResponse>;
  logout(): Promise<void>;
}
