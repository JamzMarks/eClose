import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_ACCESS = "@eclose/access_token";
const KEY_REFRESH = "@eclose/refresh_token";

export async function loadStoredTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> {
  const [accessToken, refreshToken] = await Promise.all([
    AsyncStorage.getItem(KEY_ACCESS),
    AsyncStorage.getItem(KEY_REFRESH),
  ]);
  return { accessToken, refreshToken };
}

export async function persistTokens(tokens: {
  accessToken: string;
  refreshToken?: string | null;
}): Promise<void> {
  await AsyncStorage.setItem(KEY_ACCESS, tokens.accessToken);
  if (tokens.refreshToken) {
    await AsyncStorage.setItem(KEY_REFRESH, tokens.refreshToken);
  }
}

export async function clearStoredTokens(): Promise<void> {
  await AsyncStorage.multiRemove([KEY_ACCESS, KEY_REFRESH]);
}
