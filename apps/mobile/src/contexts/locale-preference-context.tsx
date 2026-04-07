import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import i18n from "@/i18n";
import {
  loadLocalePreference,
  resolveDeviceLocale,
  saveLocalePreference,
  type AppLocale,
} from "@/lib/storage/locale-preference-storage";

export type { AppLocale };

type LocalePreferenceContextValue = {
  locale: AppLocale;
  setLocale: (l: AppLocale) => Promise<void>;
  /** `true` depois de aplicar idioma guardado ou o do dispositivo. */
  hydrated: boolean;
};

const LocalePreferenceContext = createContext<LocalePreferenceContextValue | null>(null);

export function LocalePreferenceProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("pt");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const stored = await loadLocalePreference();
      const resolved = stored ?? resolveDeviceLocale();
      await i18n.changeLanguage(resolved);
      if (!cancelled) {
        setLocaleState(resolved);
        setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback(async (l: AppLocale) => {
    setLocaleState(l);
    await i18n.changeLanguage(l);
    await saveLocalePreference(l);
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, hydrated }),
    [locale, setLocale, hydrated],
  );

  return (
    <LocalePreferenceContext.Provider value={value}>{children}</LocalePreferenceContext.Provider>
  );
}

export function useLocalePreference(): LocalePreferenceContextValue {
  const ctx = useContext(LocalePreferenceContext);
  if (!ctx) {
    throw new Error("useLocalePreference must be used within LocalePreferenceProvider");
  }
  return ctx;
}
