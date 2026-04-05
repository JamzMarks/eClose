import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@eclose/mock_session_active";

export async function setMockSessionActive(active: boolean): Promise<void> {
  if (active) {
    await AsyncStorage.setItem(KEY, "1");
  } else {
    await AsyncStorage.removeItem(KEY);
  }
}

export async function isMockSessionActive(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEY);
  return v === "1";
}
