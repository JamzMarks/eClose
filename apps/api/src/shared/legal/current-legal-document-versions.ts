/**
 * Versões correntes dos textos legais aceites no registo.
 * Sobrescrever por ambiente (`LEGAL_TERMS_VERSION` / `LEGAL_PRIVACY_VERSION`) sem alterar código.
 */
export function currentTermsVersion(): string {
  return process.env.LEGAL_TERMS_VERSION?.trim() || "2026-04-06";
}

export function currentPrivacyVersion(): string {
  return process.env.LEGAL_PRIVACY_VERSION?.trim() || "2026-04-06";
}
