import type {
  AuthTokensResponse,
  SignInRequest,
  SignUpRequest,
  UserProfileResponse,
} from "@/infrastructure/api/types/auth.types";

export interface IAuthService {
  signIn(credentials: SignInRequest): Promise<AuthTokensResponse>;
  signUp(data: SignUpRequest): Promise<AuthTokensResponse>;
  me(): Promise<UserProfileResponse>;
  refresh(refreshToken: string): Promise<AuthTokensResponse>;
  logout(): Promise<void>;
}
