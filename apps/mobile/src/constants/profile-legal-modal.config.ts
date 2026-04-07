import { getLegalUrls } from "@/constants/legal-urls";

export const PROFILE_LEGAL_MODAL_KINDS = ["privacy", "terms", "help"] as const;

export type ProfileLegalModalKind = (typeof PROFILE_LEGAL_MODAL_KINDS)[number];

export function isProfileLegalModalKind(value: string | undefined): value is ProfileLegalModalKind {
  return (
    value === "privacy" ||
    value === "terms" ||
    value === "help"
  );
}

/**
 * Configuração dos modais legais do perfil.
 * URLs vêm de `getLegalUrls()` (app.json / extra / fallbacks em `legal-urls.ts`).
 *
 * - `isExternalLink`: reservado; o conteúdo abre na app (WebView ou ecrã próprio), sem ícone de link no cabeçalho.
 * - `requiresWebView`: se true, `url` deve ser https e é mostrada no WebView; se false, `url` abre com Linking (ex.: mailto).
 */
export type ProfileLegalModalResolvedConfig = {
  titleI18nKey: "privacyPolicy" | "termsOfService" | "helpContact";
  url: string;
  isExternalLink: boolean;
  requiresWebView: boolean;
};

export function getProfileLegalModalConfig(kind: ProfileLegalModalKind): ProfileLegalModalResolvedConfig {
  const legal = getLegalUrls();
  switch (kind) {
    case "privacy":
      return {
        titleI18nKey: "privacyPolicy",
        url: legal.privacyPolicyUrl,
        isExternalLink: false,
        requiresWebView: true,
      };
    case "terms":
      return {
        titleI18nKey: "termsOfService",
        url: legal.termsOfServiceUrl,
        isExternalLink: false,
        requiresWebView: true,
      };
    case "help":
      return {
        titleI18nKey: "helpContact",
        url: legal.helpMailto,
        isExternalLink: false,
        requiresWebView: false,
      };
  }
}
