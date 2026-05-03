import type {
  AuthTokensResponse,
  OnboardingStepRequest,
  OnboardingStepResponse,
  UserProfileResponse,
} from "@/contracts/auth.types";

export const LOCAL_AUTH_TOKENS: AuthTokensResponse = {
  accessToken: "local_access_token",
  refreshToken: "local_refresh_token",
  tokenType: "Bearer",
  expiresIn: 60 * 60,
};

export const LOCAL_USER_PROFILE: UserProfileResponse = {
  id: "user_local_1",
  email: "conta@eclose.app",
  username: "utilizador_demo",
  firstName: "Demo",
  lastName: "Eclose",
  profileNamesAcknowledgedAt: new Date().toISOString(),
  emailVerifiedAt: new Date().toISOString(),
  needsEmailVerification: false,
  needsProfileNames: false,
  needsEventInterests: false,
  profileCompletion: "full",
};

export function localRefreshTokens(refreshToken: string): AuthTokensResponse {
  return {
    accessToken: "local_access_token_refreshed",
    refreshToken: refreshToken || "local_refresh_token",
    tokenType: "Bearer",
    expiresIn: 60 * 60,
  };
}

export function localOnboardingStepResponse(
  body: OnboardingStepRequest,
): OnboardingStepResponse {
  if (body.step === "names") {
    return { step: "names" };
  }
  if (body.step === "notification_preferences") {
    return {
      step: "notification_preferences",
      preferences: {
        email: body.email ?? true,
        push: body.push ?? true,
        sms: body.sms ?? false,
      },
    };
  }
  return {
    step: "event_interests",
    eventInterests: body.eventInterests ?? [],
  };
}
