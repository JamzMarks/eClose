import Constants from "expo-constants";

import type { UserProfileResponse } from "@/contracts/auth.types";

const MOCK_TOKEN = "mock-access-token-eclose";

export function isAuthMockEnabled(): boolean {
  const extra = Constants.expoConfig?.extra as Record<string, unknown> | undefined;
  if (extra?.useMockAuth === true) return true;
  if (process.env.EXPO_PUBLIC_USE_MOCK_AUTH === "true") return true;
  return false;
}

export const MOCK_USER: UserProfileResponse = {
  id: "550e8400-e29b-41d4-a716-446655440099",
  email: "explorador@mock.eclose.app",
  username: "explorador_mock",
  firstName: "Explorador",
  lastName: "Mock",
  profileNamesAcknowledgedAt: new Date().toISOString(),
  emailVerifiedAt: new Date().toISOString(),
  needsEmailVerification: false,
  needsProfileNames: false,
  needsEventInterests: false,
  profileCompletion: "full",
};

export function getMockAccessToken(): string {
  return MOCK_TOKEN;
}
