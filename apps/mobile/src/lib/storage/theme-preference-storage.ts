import { appLocalStorage } from "@/lib/storage/app-local-storage";

/** Chave curta — ver comentário em `app-local-storage.ts`. */
export const THEME_PREFERENCE_STORAGE_KEY = "prefs.theme";

export type ThemePreference = "light" | "dark" | "system";

function parse(raw: string | null): ThemePreference {
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return "system";
}

export async function loadThemePreference(): Promise<ThemePreference> {
  const raw = await appLocalStorage.getString(THEME_PREFERENCE_STORAGE_KEY);
  return parse(raw);
}

export async function saveThemePreference(value: ThemePreference): Promise<void> {
  await appLocalStorage.setString(THEME_PREFERENCE_STORAGE_KEY, value);
}
