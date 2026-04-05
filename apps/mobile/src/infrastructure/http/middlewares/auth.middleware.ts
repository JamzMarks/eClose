let token: string | null = null;

export function setAuthAccessToken(newToken: string | null) {
  token = newToken;
}

/** @deprecated use setAuthAccessToken */
export function setToken(newToken: string) {
  setAuthAccessToken(newToken);
}

export function getAuthAccessToken(): string | null {
  return token;
}

export function clearAuthAccessToken() {
  token = null;
}

export const authMiddleware = async (config: RequestInit) => {
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};