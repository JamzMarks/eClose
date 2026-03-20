let token: string | null = null;

export function setToken(newToken: string) {
  token = newToken;
}

export const authMiddleware = async (config: RequestInit) => {
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
};