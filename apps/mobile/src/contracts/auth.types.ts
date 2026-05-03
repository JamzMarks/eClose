export type SignInRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  username: string;
  email: string;
  password: string;
  /** Versões dos textos legais aceites (omissão na API usa valor do servidor). */
  termsVersion?: string;
  privacyVersion?: string;
};

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken?: string;
  tokenType?: "Bearer";
  expiresIn?: number;
};

/** Alinhado com `OAuthProviderId` na API (`google` | `apple`). */
export type OAuthProviderId = "google" | "apple";

export type OAuthStartResponse = {
  authorizationUrl: string;
  state: string;
  codeVerifier?: string;
};

export type OAuthCallbackRequest = {
  provider: OAuthProviderId;
  code: string;
  redirectUri: string;
  codeVerifier?: string;
  state?: string;
};

export type AuthProfileCompletion = "minimal" | "verified" | "full";

export type UserProfileResponse = {
  id: string;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  profileNamesAcknowledgedAt: string | null;
  emailVerifiedAt: string | null;
  needsEmailVerification: boolean;
  needsProfileNames: boolean;
  needsEventInterests: boolean;
  profileCompletion: AuthProfileCompletion;
};

export type OnboardingStepKind =
  | "names"
  | "notification_preferences"
  | "event_interests";

export type OnboardingStepRequest =
  | { step: "names"; firstName: string; lastName: string }
  | {
      step: "notification_preferences";
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    }
  | { step: "event_interests"; eventInterests: string[] };

export type NotificationPreferencesPayload = {
  email: boolean;
  push: boolean;
  sms: boolean;
};

export type OnboardingStepResponse =
  | { step: "names" }
  | {
      step: "notification_preferences";
      preferences: NotificationPreferencesPayload;
    }
  | { step: "event_interests"; eventInterests: string[] };

