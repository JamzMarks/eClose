export type SignInRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  email: string;
  password: string;
};

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken?: string;
  tokenType?: "Bearer";
  expiresIn?: number;
};

export type UserProfileResponse = {
  id: string;
  email: string;
};
