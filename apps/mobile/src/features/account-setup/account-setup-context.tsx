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

import { useAuth } from "@/contexts/auth-context";

import { ContinueSetupSheet } from "./continue-setup-sheet";
import { EmailVerificationSetupSheet } from "./email-verification-setup-sheet";
import { ProfileNamesSetupSheet } from "./profile-names-setup-sheet";
import {
  loadAccountSetupNotificationPrefs,
  saveAccountSetupNotificationPrefsCompleted,
  saveAccountSetupNotificationPrefsSkipped,
} from "./account-setup-prefs-storage";

type OpenReason = "post_signup" | "manual" | null;

type AccountSetupContextValue = {
  /** Abre o sheet de notificações (ex.: a partir de Definições). */
  openNotificationPreferencesSetup: () => void;
};

const AccountSetupContext = createContext<AccountSetupContextValue | null>(null);

export function AccountSetupProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn, refreshUser } = useAuth();
  const [openReason, setOpenReason] = useState<OpenReason>(null);
  const [namesSheetOpen, setNamesSheetOpen] = useState(false);
  const [emailSheetOpen, setEmailSheetOpen] = useState(false);
  const lastCheckedUserId = useRef<string | null>(null);
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
      const state = await loadAccountSetupNotificationPrefs(user.id);
      if (cancelled) return;
      if (!state.completed && !state.skipped) {
        setOpenReason("post_signup");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, user?.id, user?.needsEmailVerification, user?.needsProfileNames]);

  const openNotificationPreferencesSetup = useCallback(() => {
    setOpenReason("manual");
  }, []);

  const handleDismiss = useCallback(
    async (reason: "save" | "skip" | "close") => {
      const uid = user?.id;
      if (uid) {
        if (reason === "save") {
          await saveAccountSetupNotificationPrefsCompleted(uid);
        } else if (reason === "skip") {
          await saveAccountSetupNotificationPrefsSkipped(uid);
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
  const notifMode = openReason === "manual" ? "manual" : "account_flow";

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

  const handleEmailDismiss = useCallback((reason: "verified" | "later") => {
    if (reason === "later") {
      emailDeferredRef.current = true;
    }
    setEmailSheetOpen(false);
  }, []);

  const value = useMemo(
    () => ({ openNotificationPreferencesSetup }),
    [openNotificationPreferencesSetup],
  );

  return (
    <AccountSetupContext.Provider value={value}>
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
          mode={notifMode}
          onDismiss={handleDismiss}
        />
      ) : null}
    </AccountSetupContext.Provider>
  );
}

export function useAccountSetup(): AccountSetupContextValue {
  const ctx = useContext(AccountSetupContext);
  if (!ctx) {
    throw new Error("useAccountSetup deve ser usado dentro de AccountSetupProvider");
  }
  return ctx;
}
