import { MfaSetupDto } from "../dto/mfa-setup.dto";
import { SignInDto } from "../dto/signin.dto";
import { SignUpDto } from "../dto/signup.dto";
import { UserProfileDto } from "./dto/user-profile.dto";

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface IAuthService {
  // core
  signUp(dto: SignUpDto): Promise<AuthResponse>;
  signIn(dto: SignInDto): Promise<AuthResponse>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
  logout(userId: string): Promise<void>;
  me(userId: string): Promise<UserProfileDto>;

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