import type {
  AuthTokensResponse,
  OAuthCallbackRequest,
  OAuthStartResponse,
  OnboardingStepRequest,
  OnboardingStepResponse,
  OAuthProviderId,
  SignInRequest,
  SignUpRequest,
  UserProfileResponse,
} from "@/contracts/auth.types";

export type OAuthStartBody = {
  provider: OAuthProviderId;
  redirectUri: string;
  state?: string;
};

export interface IAuthService {
  signIn(credentials: SignInRequest): Promise<AuthTokensResponse>;
  signUp(data: SignUpRequest): Promise<AuthTokensResponse>;
  oauthStart(body: OAuthStartBody): Promise<OAuthStartResponse>;
  oauthCallback(body: OAuthCallbackRequest): Promise<AuthTokensResponse>;
  sendEmailVerification(): Promise<void>;
  confirmEmailVerification(token: string): Promise<void>;
  me(): Promise<UserProfileResponse>;
  submitOnboardingStep(body: OnboardingStepRequest): Promise<OnboardingStepResponse>;
  refresh(refreshToken: string): Promise<AuthTokensResponse>;
  logout(): Promise<void>;
}
