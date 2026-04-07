import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AppCapability } from "./app-capability";
import { getCapabilitiesForAppIntroOutcome } from "./app-intro-policy.mock";
import { loadPersistedAppIntro, persistAppIntro } from "./app-intro-storage";

type AppIntroContextValue = {
  hydrated: boolean;
  /** Intro de boas-vindas ainda não concluído nem saltado (persistido em disco). */
  introPending: boolean;
  capabilities: ReadonlySet<AppCapability>;
  completeIntro: () => Promise<void>;
  skipIntro: () => Promise<void>;
  canAccess: (cap: AppCapability) => boolean;
};

const AppIntroContext = createContext<AppIntroContextValue | null>(null);

export function AppIntroProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [introPending, setIntroPending] = useState(true);
  const [capabilities, setCapabilities] = useState<ReadonlySet<AppCapability>>(() => new Set());

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const stored = await loadPersistedAppIntro();
      if (cancelled) return;
      if (stored) {
        setIntroPending(false);
        setCapabilities(new Set(stored.capabilities));
      } else {
        setIntroPending(true);
        setCapabilities(new Set());
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const finish = useCallback(async (mode: "completed" | "skipped") => {
    const next = getCapabilitiesForAppIntroOutcome(mode);
    setCapabilities(next);
    setIntroPending(false);
    await persistAppIntro({
      finished: true,
      mode,
      capabilities: [...next],
    });
  }, []);

  const completeIntro = useCallback(() => finish("completed"), [finish]);
  const skipIntro = useCallback(() => finish("skipped"), [finish]);

  const canAccess = useCallback(
    (cap: AppCapability) => capabilities.has(cap),
    [capabilities],
  );

  const value = useMemo<AppIntroContextValue>(
    () => ({
      hydrated,
      introPending,
      capabilities,
      completeIntro,
      skipIntro,
      canAccess,
    }),
    [hydrated, introPending, capabilities, completeIntro, skipIntro, canAccess],
  );

  return <AppIntroContext.Provider value={value}>{children}</AppIntroContext.Provider>;
}

export function useAppIntro() {
  const ctx = useContext(AppIntroContext);
  if (!ctx) {
    throw new Error("useAppIntro must be used within AppIntroProvider");
  }
  return ctx;
}
