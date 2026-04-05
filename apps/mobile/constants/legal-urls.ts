import Constants from "expo-constants";

export type LegalUrls = {
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  helpMailto: string;
};

const FALLBACK_PRIVACY = "https://eclose.app/privacy";
const FALLBACK_TERMS = "https://eclose.app/terms";
const FALLBACK_HELP = "mailto:support@eclose.app";

/**
 * URLs legais e contacto — sobrescreve via `expo.extra` em app.json ou EAS env.
 */
export function getLegalUrls(): LegalUrls {
  const extra = Constants.expoConfig?.extra as Record<string, unknown> | undefined;
  return {
    privacyPolicyUrl:
      typeof extra?.privacyPolicyUrl === "string" && extra.privacyPolicyUrl.length > 0
        ? extra.privacyPolicyUrl
        : FALLBACK_PRIVACY,
    termsOfServiceUrl:
      typeof extra?.termsOfServiceUrl === "string" && extra.termsOfServiceUrl.length > 0
        ? extra.termsOfServiceUrl
        : FALLBACK_TERMS,
    helpMailto:
      typeof extra?.helpMailto === "string" && extra.helpMailto.length > 0
        ? extra.helpMailto
        : FALLBACK_HELP,
  };
}
