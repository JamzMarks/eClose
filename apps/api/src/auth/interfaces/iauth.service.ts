import { SignInDto } from "../dto/signin.dto";
import { SignUpDto } from "../dto/signup.dto";

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface IAuthService {

  signUp(dto: SignUpDto): Promise<AuthResponse>;

  signIn(dto: SignInDto): Promise<AuthResponse>;

  refreshToken(refreshToken: string): Promise<AuthResponse>;

  me(userId: string): Promise<any>;

  logout(userId: string): Promise<void>;

}