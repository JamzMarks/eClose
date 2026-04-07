import { useColorScheme as useRNColorScheme } from "react-native";

import { useOptionalThemePreference } from "@/contexts/theme-preference-context";

/**
 * Esquema de cor efectivo para a UI. Preferência em `prefs.theme` (light/dark) tem prioridade
 * sobre o sistema; com `system` usa-se o esquema do dispositivo.
 */
export function useColorScheme() {
  const ctx = useOptionalThemePreference();
  const system = useRNColorScheme();

  if (!ctx) {
    return system;
  }

  const { preference, hydrated } = ctx;
  if (!hydrated) {
    return system;
  }
  if (preference === "system") {
    return system;
  }
  return preference;
}
