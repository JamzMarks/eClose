import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, type ReactNode } from "react";

import { useAuth } from "@/contexts/auth-context";
import { useLocalePreference } from "@/contexts/locale-preference-context";
import { useThemePreference } from "@/contexts/theme-preference-context";

/**
 * Esconde o splash só depois da sessão estar pronta e das preferências locais (tema, idioma) hidratadas,
 * para reduzir um frame com tema ou cópia errados.
 */
export function SplashScreenGate({ children }: { children: ReactNode }) {
  const { isReady } = useAuth();
  const { hydrated: themeHydrated } = useThemePreference();
  const { hydrated: localeHydrated } = useLocalePreference();
  const hiddenRef = useRef(false);

  useEffect(() => {
    if (!isReady || !themeHydrated || !localeHydrated || hiddenRef.current) return;
    hiddenRef.current = true;
    void SplashScreen.hideAsync();
  }, [isReady, themeHydrated, localeHydrated]);

  return children;
}
