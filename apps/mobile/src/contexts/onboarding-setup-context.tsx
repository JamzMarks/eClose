import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ContinueSetupSheet } from "@/components/onboarding/continue-setup-sheet";
import { EmailVerificationSetupSheet } from "@/components/onboarding/email-verification-setup-sheet";
import { ProfileNamesSetupSheet } from "@/components/onboarding/profile-names-setup-sheet";
import { useAuth } from "@/contexts/auth-context";
import {
  loadPrefsOnboardingState,
  savePrefsOnboardingCompleted,
  savePrefsOnboardingSkipped,
} from "@/lib/session/onboarding-storage";

type OpenReason = "onboarding" | "manual" | null;

type OnboardingSetupContextValue = {
  /** Abre o sheet (ex.: a partir do perfil) para rever preferências. */
  openNotificationPreferencesSetup: () => void;
};

const OnboardingSetupContext =
  createContext<OnboardingSetupContextValue | null>(null);

export function OnboardingSetupProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn, refreshUser } = useAuth();
  const [openReason, setOpenReason] = useState<OpenReason>(null);
  const [namesSheetOpen, setNamesSheetOpen] = useState(false);
  const [emailSheetOpen, setEmailSheetOpen] = useState(false);
  const lastCheckedUserId = useRef<string | null>(null);
  /** Utilizador escolheu "Agora não" no sheet de nomes; não reabrir até mudar de conta ou concluir. */
  const namesDeferredRef = useRef(false);
  const emailDeferredRef = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !user?.id) {
      lastCheckedUserId.current = null;
      namesDeferredRef.current = false;
      emailDeferredRef.current = false;
      setOpenReason(null);
      setNamesSheetOpen(false);
      setEmailSheetOpen(false);
      return;
    }

    if (user.needsEmailVerification) {
      if (!emailDeferredRef.current) {
        setEmailSheetOpen(true);
      }
      setNamesSheetOpen(false);
      setOpenReason(null);
      return;
    }

    emailDeferredRef.current = false;
    setEmailSheetOpen(false);

    if (user.needsProfileNames) {
      if (!namesDeferredRef.current) {
        setNamesSheetOpen(true);
      }
      setOpenReason(null);
      return;
    }

    namesDeferredRef.current = false;
    setNamesSheetOpen(false);

    if (lastCheckedUserId.current === user.id) {
      return;
    }
    lastCheckedUserId.current = user.id;

    let cancelled = false;
    void (async () => {
      const state = await loadPrefsOnboardingState(user.id);
      if (cancelled) return;
      if (!state.completed && !state.skipped) {
        setOpenReason("onboarding");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isSignedIn,
    user?.id,
    user?.needsEmailVerification,
    user?.needsProfileNames,
  ]);

  const openNotificationPreferencesSetup = useCallback(() => {
    setOpenReason("manual");
  }, []);

  const handleDismiss = useCallback(
    async (reason: "save" | "skip" | "close") => {
      const uid = user?.id;
      if (uid) {
        if (reason === "save") {
          await savePrefsOnboardingCompleted(uid);
        } else if (reason === "skip") {
          await savePrefsOnboardingSkipped(uid);
        }
      }
      setOpenReason(null);
    },
    [user?.id],
  );

  const notifVisible =
    openReason !== null &&
    !user?.needsEmailVerification &&
    !user?.needsProfileNames;
  const mode = openReason === "manual" ? "manual" : "onboarding";

  const handleNamesDismiss = useCallback(
    async (reason: "saved" | "later") => {
      if (reason === "saved") {
        setNamesSheetOpen(false);
        await refreshUser();
      } else {
        namesDeferredRef.current = true;
        setNamesSheetOpen(false);
      }
    },
    [refreshUser],
  );

  const handleEmailDismiss = useCallback(
    (reason: "verified" | "later") => {
      if (reason === "later") {
        emailDeferredRef.current = true;
      }
      setEmailSheetOpen(false);
    },
    [],
  );

  const value = useMemo(
    () => ({ openNotificationPreferencesSetup }),
    [openNotificationPreferencesSetup],
  );

  return (
    <OnboardingSetupContext.Provider value={value}>
      {children}
      {user?.id && emailSheetOpen ? (
        <EmailVerificationSetupSheet
          visible={emailSheetOpen}
          user={user}
          onRefreshProfile={refreshUser}
          onDismiss={handleEmailDismiss}
        />
      ) : null}
      {user?.id && namesSheetOpen ? (
        <ProfileNamesSetupSheet
          visible={namesSheetOpen}
          user={user}
          onDismiss={handleNamesDismiss}
        />
      ) : null}
      {user?.id ? (
        <ContinueSetupSheet
          visible={notifVisible}
          mode={mode}
          onDismiss={handleDismiss}
        />
      ) : null}
    </OnboardingSetupContext.Provider>
  );
}

export function useOnboardingSetup(): OnboardingSetupContextValue {
  const ctx = useContext(OnboardingSetupContext);
  if (!ctx) {
    throw new Error(
      "useOnboardingSetup deve ser usado dentro de OnboardingSetupProvider",
    );
  }
  return ctx;
}
