import Constants from "expo-constants";

/**
 * URL base da API eClose.
 * Definir `EXPO_PUBLIC_API_URL` no `.env` ou `extra.apiUrl` em app.json.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv?.trim()) {
    return fromEnv.replace(/\/$/, "");
  }
  const extra = Constants.expoConfig?.extra as { apiUrl?: string } | undefined;
  if (extra?.apiUrl?.trim()) {
    return extra.apiUrl.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}
