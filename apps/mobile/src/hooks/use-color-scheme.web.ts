import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

import { useOptionalThemePreference } from "@/contexts/theme-preference-context";

/**
 * Web: valor estável no SSR; no cliente aplica preferência persistida (igual ao nativo).
 */
export function useColorScheme() {
  const [webHydrated, setWebHydrated] = useState(false);
  const ctx = useOptionalThemePreference();
  const system = useRNColorScheme();

  useEffect(() => {
    setWebHydrated(true);
  }, []);

  if (!webHydrated) {
    return "light";
  }

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
