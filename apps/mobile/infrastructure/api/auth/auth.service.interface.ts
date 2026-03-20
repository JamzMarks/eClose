export interface IAuthService {
  me(): Promise<UserResponse>;
  signin(credentials: SignInRequest): Promise<AuthResponse>;
  signup(data: SignUpRequest): Promise<AuthResponse>;
  signout(): Promise<void>;
}