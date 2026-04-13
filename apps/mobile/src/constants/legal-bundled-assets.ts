import type { LegalBundledLang } from "./legal-document-url";

/**
 * IDs de asset Metro para HTML empacotado (fallback offline).
 * Requer `metro.config.js` com `html` em `assetExts`.
 */
export function getLegalBundledHtmlModule(kind: "privacy" | "terms", lang: LegalBundledLang): number {
  if (kind === "terms") {
    return lang === "en"
      ? require("../../assets/legal/terms-en.html")
      : require("../../assets/legal/terms-pt.html");
  }
  return lang === "en"
    ? require("../../assets/legal/privacy-en.html")
    : require("../../assets/legal/privacy-pt.html");
}
