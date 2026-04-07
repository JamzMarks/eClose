import AsyncStorage from "@react-native-async-storage/async-storage";

import { APP_STORAGE_PREFIX } from "@/lib/storage/storage-keys";

function namespacedKey(shortKey: string): string {
  const k = shortKey.startsWith("@") ? shortKey : `${APP_STORAGE_PREFIX}/${shortKey}`;
  return k;
}

/**
 * Armazenamento local genérico (AsyncStorage). Usar chaves curtas por domínio, ex. `prefs.theme`.
 * Dados sensíveis → preferir `expo-secure-store` noutro módulo.
 */
export const appLocalStorage = {
  async getString(shortKey: string): Promise<string | null> {
    return AsyncStorage.getItem(namespacedKey(shortKey));
  },

  async setString(shortKey: string, value: string): Promise<void> {
    await AsyncStorage.setItem(namespacedKey(shortKey), value);
  },

  async remove(shortKey: string): Promise<void> {
    await AsyncStorage.removeItem(namespacedKey(shortKey));
  },

  async getJson<T>(shortKey: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(namespacedKey(shortKey));
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async setJson(shortKey: string, value: unknown): Promise<void> {
    await AsyncStorage.setItem(namespacedKey(shortKey), JSON.stringify(value));
  },

  async multiRemove(shortKeys: string[]): Promise<void> {
    await AsyncStorage.multiRemove(shortKeys.map(namespacedKey));
  },
};
