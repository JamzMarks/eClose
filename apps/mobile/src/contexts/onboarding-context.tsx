import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AppCapability } from "@/onboarding/app-capability";
import { getCapabilitiesForOnboardingOutcome } from "@/onboarding/onboarding-policy.mock";
import { loadPersistedOnboarding, persistOnboarding } from "@/onboarding/onboarding-storage";

type OnboardingContextValue = {
  hydrated: boolean;
  /** Utilizador ainda não concluiu nem saltou o intro (persistido). */
  introPending: boolean;
  capabilities: ReadonlySet<AppCapability>;
  completeIntro: () => Promise<void>;
  skipIntro: () => Promise<void>;
  canAccess: (cap: AppCapability) => boolean;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [introPending, setIntroPending] = useState(true);
  const [capabilities, setCapabilities] = useState<ReadonlySet<AppCapability>>(() => new Set());

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const stored = await loadPersistedOnboarding();
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
    const next = getCapabilitiesForOnboardingOutcome(mode);
    setCapabilities(next);
    setIntroPending(false);
    await persistOnboarding({
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

  const value = useMemo<OnboardingContextValue>(
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

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return ctx;
}
