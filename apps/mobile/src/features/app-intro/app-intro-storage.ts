import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AppCapability } from "./app-capability";
import type { AppIntroFinishMode } from "./app-intro-policy.mock";

const STORAGE_KEY = "@eclose/app_intro_v1";

export type PersistedAppIntroState = {
  finished: true;
  mode: AppIntroFinishMode;
  capabilities: AppCapability[];
};

export async function loadPersistedAppIntro(): Promise<PersistedAppIntroState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PersistedAppIntroState;
    if (!parsed?.finished || !parsed.mode || !Array.isArray(parsed.capabilities)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function persistAppIntro(state: PersistedAppIntroState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
