/** Prefixo único para não colidir com tokens/sessão (`@eclose/…`). */
export const APP_STORAGE_PREFIX = "@eclose/app";

export const AppStorageKey = {
   locationSnapshot: `${APP_STORAGE_PREFIX}/location_snapshot_v1`,
  /** Preferência de tema — valor em `appLocalStorage` via chave curta `prefs.theme`. */
  themePreference: `${APP_STORAGE_PREFIX}/prefs.theme`,
  /** Idioma da app (`prefs.locale` em `appLocalStorage`). */
  localePreference: `${APP_STORAGE_PREFIX}/prefs.locale`,
} as const;
