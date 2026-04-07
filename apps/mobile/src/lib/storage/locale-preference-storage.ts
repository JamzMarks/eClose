import * as Localization from "expo-localization";

import { appLocalStorage } from "@/lib/storage/app-local-storage";

export const LOCALE_PREFERENCE_STORAGE_KEY = "prefs.locale";

export type AppLocale = "pt" | "en";

function parse(raw: string | null): AppLocale | null {
  if (raw === "pt" || raw === "en") return raw;
  return null;
}

/** Preferência explícita do utilizador; `null` se ainda não escolheu (usa resolução por dispositivo). */
export async function loadLocalePreference(): Promise<AppLocale | null> {
  const raw = await appLocalStorage.getString(LOCALE_PREFERENCE_STORAGE_KEY);
  return parse(raw);
}

export async function saveLocalePreference(value: AppLocale): Promise<void> {
  await appLocalStorage.setString(LOCALE_PREFERENCE_STORAGE_KEY, value);
}

/** Primeira abertura: inferir `pt` vs `en` a partir do idioma do sistema. */
export function resolveDeviceLocale(): AppLocale {
  const code = Localization.getLocales()[0]?.languageCode?.toLowerCase();
  if (code?.startsWith("pt")) return "pt";
  return "en";
}
