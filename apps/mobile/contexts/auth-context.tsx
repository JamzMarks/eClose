import * as SplashScreen from "expo-splash-screen";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AuthService } from "@/infrastructure/api/auth/auth.service";
import type { IAuthService } from "@/infrastructure/api/auth/auth.service.interface";
import type { UserProfileResponse } from "@/infrastructure/api/types/auth.types";
import {
  clearAuthAccessToken,
  setAuthAccessToken,
} from "@/infrastructure/http/middlewares/auth.middleware";
import {
  clearStoredTokens,
  loadStoredTokens,
  persistTokens,
} from "@/lib/session/session-storage";
import { subscribeSessionInvalidated } from "@/lib/session/session-invalidate";
import { registerDevicePushToken } from "@/lib/push/register-device-push-token";

SplashScreen.preventAutoHideAsync().catch(() => {});

type AuthContextValue = {
  isReady: boolean;
  isSignedIn: boolean;
  user: UserProfileResponse | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  authService = new AuthService(),
}: {
  children: ReactNode;
  authService?: IAuthService;
}) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<UserProfileResponse | null>(null);

  const hydrate = useCallback(async () => {
    try {
      const { accessToken } = await loadStoredTokens();
      if (!accessToken) {
        setAuthAccessToken(null);
        setUser(null);
        return;
      }
      setAuthAccessToken(accessToken);
      const profile = await authService.me();
      setUser(profile);
    } catch {
      setAuthAccessToken(null);
      setUser(null);
      await clearStoredTokens();
    } finally {
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
  }, [authService]);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    return subscribeSessionInvalidated(() => {
      setUser(null);
    });
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    void registerDevicePushToken();
  }, [user?.id]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const tokens = await authService.signIn({ email, password });
      await persistTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? null,
      });
      setAuthAccessToken(tokens.accessToken);
      const profile = await authService.me();
      setUser(profile);
    },
    [authService],
  );

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // sessão local limpa mesmo se o servidor falhar
    } finally {
      await clearStoredTokens();
      clearAuthAccessToken();
      setUser(null);
    }
  }, [authService]);

  const refreshUser = useCallback(async () => {
    const profile = await authService.me();
    setUser(profile);
  }, [authService]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isReady,
      isSignedIn: !!user,
      user,
      signIn,
      signOut,
      refreshUser,
    }),
    [isReady, user, signIn, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
