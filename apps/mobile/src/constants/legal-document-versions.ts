import Constants from "expo-constants";

const FALLBACK = "2026-04-06";

function readExtra(key: string): string {
  const extra = Constants.expoConfig?.extra as Record<string, unknown> | undefined;
  const v = extra?.[key];
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : FALLBACK;
}

/** Alinhar com `LEGAL_TERMS_VERSION` / `currentTermsVersion()` na API. */
export function getClientTermsVersion(): string {
  return readExtra("legalTermsVersion");
}

/** Alinhar com `LEGAL_PRIVACY_VERSION` / `currentPrivacyVersion()` na API. */
export function getClientPrivacyVersion(): string {
  return readExtra("legalPrivacyVersion");
}
