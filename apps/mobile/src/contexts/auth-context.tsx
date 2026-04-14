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

import { runOAuthBrowserFlow } from "@/features/auth/run-oauth-login";
import { AuthService } from "@/services/auth/auth.service";
import type { IAuthService } from "@/services/auth/auth.service.interface";
import type { OAuthProviderId, SignUpRequest, UserProfileResponse } from "@/services/types/auth.types";
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
import {
  getMockAccessToken,
  isAuthMockEnabled,
  MOCK_USER,
} from "@/lib/auth-mock";
import { isMockSessionActive, setMockSessionActive } from "@/lib/session/mock-auth-flag";

SplashScreen.preventAutoHideAsync().catch(() => {});

type AuthContextValue = {
  isReady: boolean;
  isSignedIn: boolean;
  user: UserProfileResponse | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInMock: () => Promise<void>;
  signInWithOAuth: (provider: OAuthProviderId) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
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
      const mockEnabled = isAuthMockEnabled();
      const mockActive = await isMockSessionActive();
      if (mockEnabled && mockActive) {
        setAuthAccessToken(getMockAccessToken());
        setUser(MOCK_USER);
        return;
      }

      const { accessToken } = await loadStoredTokens();
      if (!accessToken) {
        setAuthAccessToken(null);
        setUser(null);
        return;
      }
      if (mockEnabled && accessToken === getMockAccessToken()) {
        await setMockSessionActive(true);
        setAuthAccessToken(accessToken);
        setUser(MOCK_USER);
        return;
      }
      setAuthAccessToken(accessToken);
      const profile = await authService.me();
      setUser(profile);
    } catch {
      setAuthAccessToken(null);
      setUser(null);
      await clearStoredTokens();
      await setMockSessionActive(false);
    } finally {
      setIsReady(true);
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
    if (isAuthMockEnabled() && user.id === MOCK_USER.id) return;
    void registerDevicePushToken();
  }, [user?.id]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await setMockSessionActive(false);
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

  const signInMock = useCallback(async () => {
    await setMockSessionActive(true);
    const token = getMockAccessToken();
    await persistTokens({ accessToken: token, refreshToken: null });
    setAuthAccessToken(token);
    setUser(MOCK_USER);
  }, []);

  const signInWithOAuth = useCallback(
    async (provider: OAuthProviderId) => {
      await setMockSessionActive(false);
      const tokens = await runOAuthBrowserFlow(authService, provider);
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

  const signUp = useCallback(
    async (data: SignUpRequest) => {
      await setMockSessionActive(false);
      const tokens = await authService.signUp(data);
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
      if (!isAuthMockEnabled() || user?.id !== MOCK_USER.id) {
        await authService.logout();
      }
    } catch {
      // sessão local limpa mesmo se o servidor falhar
    } finally {
      await clearStoredTokens();
      await setMockSessionActive(false);
      clearAuthAccessToken();
      setUser(null);
    }
  }, [authService, user?.id]);

  const refreshUser = useCallback(async () => {
    if (user?.id === MOCK_USER.id && (await isMockSessionActive())) {
      setUser(MOCK_USER);
      return;
    }
    const profile = await authService.me();
    setUser(profile);
  }, [authService, user?.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isReady,
      isSignedIn: !!user,
      user,
      signIn,
      signInMock,
      signInWithOAuth,
      signUp,
      signOut,
      refreshUser,
    }),
    [isReady, user, signIn, signInMock, signInWithOAuth, signUp, signOut, refreshUser],
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
