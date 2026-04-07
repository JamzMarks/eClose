import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

import {
  loadThemePreference,
  saveThemePreference,
  type ThemePreference,
} from "@/lib/storage/theme-preference-storage";

export type { ThemePreference };

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  /** Esquema efectivo (light/dark) após aplicar a preferência. */
  resolvedScheme: "light" | "dark";
  setPreference: (p: ThemePreference) => Promise<void>;
  /** `true` depois de ler o AsyncStorage. */
  hydrated: boolean;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const system = useRNColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const p = await loadThemePreference();
      if (!cancelled) {
        setPreferenceState(p);
        setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const resolvedScheme: "light" | "dark" =
    preference === "system" ? (system ?? "light") : preference;

  const setPreference = useCallback(async (p: ThemePreference) => {
    setPreferenceState(p);
    await saveThemePreference(p);
  }, []);

  const value = useMemo(
    () => ({ preference, resolvedScheme, setPreference, hydrated }),
    [preference, resolvedScheme, setPreference, hydrated],
  );

  return (
    <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>
  );
}

export function useThemePreference(): ThemePreferenceContextValue {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error("useThemePreference must be used within ThemePreferenceProvider");
  }
  return ctx;
}

export function useOptionalThemePreference(): ThemePreferenceContextValue | null {
  return useContext(ThemePreferenceContext);
}
