/**
 * Parâmetros de consulta que o site legal pode usar para tema e língua
 * (ex.: CSS condicional ou conteúdo alternativo).
 *
 * Contrato sugerido para o servidor: `app_lang` ∈ pt | en, `app_theme` ∈ light | dark.
 */
export type LegalBundledLang = "pt" | "en";

export type LegalViewerUrlOptions = {
  lang: string;
  theme: "light" | "dark";
};

/** Normaliza códigos tipo `en-US` para `en`. */
export function normalizeLegalLang(i18nLanguage: string): LegalBundledLang {
  const base = i18nLanguage.split("-")[0]?.toLowerCase() ?? "pt";
  return base === "en" ? "en" : "pt";
}

export function appendLegalViewerParams(url: string, opts: LegalViewerUrlOptions): string {
  try {
    const u = new URL(url);
    u.searchParams.set("app_lang", normalizeLegalLang(opts.lang));
    u.searchParams.set("app_theme", opts.theme);
    return u.toString();
  } catch {
    return url;
  }
}
