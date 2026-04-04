import { MfaSetupDto } from "@/auth/interface/http/dto/mfa-setup.dto";
import { OnboardingStepDto } from "@/auth/interface/http/dto/onboarding-step.dto";
import { SignInDto } from "@/auth/interface/http/dto/signin.dto";
import { SignUpDto } from "@/auth/interface/http/dto/signup.dto";
import { UserProfileDto } from "@/auth/interface/http/dto/user-profile.dto";
import { OAuthCallbackDto } from "@/auth/interface/http/dto/oauth-callback.dto";
import { OAuthStartDto } from "@/auth/interface/http/dto/oauth-start.dto";
import type { UserNotificationPreferences } from "@/user/application/ports/user.service.interface";
import { OAuthAuthorizeResult } from "./oauth-provider-gateway.interface";

export type OnboardingStepResult =
  | { step: "names" }
  | { step: "notification_preferences"; preferences: UserNotificationPreferences }
  | { step: "event_interests"; eventInterests: string[] };

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: "Bearer";
  expiresIn?: number;
}

export interface IAuthService {
  // core
  signUp(dto: SignUpDto): Promise<AuthResponse>;
  signIn(dto: SignInDto): Promise<AuthResponse>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
  logout(userId: string): Promise<void>;
  me(userId: string): Promise<UserProfileDto>;
  submitOnboardingStep(userId: string, dto: OnboardingStepDto): Promise<OnboardingStepResult>;

  // OAuth2 / OpenID (delegação ao gateway; infra de providers fica fora do domínio)
  startOAuthLogin(dto: OAuthStartDto): Promise<OAuthAuthorizeResult>;
  completeOAuthLogin(dto: OAuthCallbackDto): Promise<AuthResponse>;

  // sessão
  revokeToken(token: string): Promise<void>;
  revokeAllSessions(userId: string): Promise<void>;
  // getActiveSessions(userId: string): Promise<UserSessionDto[]>;

  // senha
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;

  // email
  sendEmailVerification(userId: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;
  changeEmail(userId: string, newEmail: string): Promise<void>;

  // MFA
  enableMfa(userId: string): Promise<MfaSetupDto>;
  verifyMfa(userId: string, code: string): Promise<boolean>;
  disableMfa(userId: string, code: string): Promise<void>;
}