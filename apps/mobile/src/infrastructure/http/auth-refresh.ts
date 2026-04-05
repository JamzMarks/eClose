import { getApiBaseUrl } from "@/infrastructure/http/api-config";
import {
  clearAuthAccessToken,
  setAuthAccessToken,
} from "@/infrastructure/http/middlewares/auth.middleware";
import {
  clearStoredTokens,
  loadStoredTokens,
  persistTokens,
} from "@/lib/session/session-storage";
import { emitSessionInvalidated } from "@/lib/session/session-invalidate";

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

/**
 * Renova access token com `POST /auth/refresh` sem passar pelo HttpClient (evita ciclos).
 * @returns true se obteve novo access token
 */
export async function tryRefreshAccessToken(): Promise<boolean> {
  const { refreshToken } = await loadStoredTokens();
  if (!refreshToken?.trim()) {
    return false;
  }

  const url = `${getApiBaseUrl()}/auth/refresh`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return false;
  }

  if (!response.ok) {
    return false;
  }

  let body: RefreshResponse;
  try {
    body = (await response.json()) as RefreshResponse;
  } catch {
    return false;
  }

  if (!body?.accessToken?.trim()) {
    return false;
  }

  await persistTokens({
    accessToken: body.accessToken,
    refreshToken: body.refreshToken ?? refreshToken,
  });
  setAuthAccessToken(body.accessToken);
  return true;
}

/** Limpa sessão e notifica ouvintes (ex.: AuthProvider). */
export async function forceLogoutSession(): Promise<void> {
  await clearStoredTokens();
  clearAuthAccessToken();
  emitSessionInvalidated();
}
