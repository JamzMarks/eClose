import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AppCapability } from "@/onboarding/app-capability";
import type { OnboardingFinishMode } from "@/onboarding/onboarding-policy.mock";

const STORAGE_KEY = "@eclose/app_intro_v1";

export type PersistedOnboardingState = {
  finished: true;
  mode: OnboardingFinishMode;
  /** Snapshot das capacidades efectivas após conclusão (útil offline / testes). */
  capabilities: AppCapability[];
};

export async function loadPersistedOnboarding(): Promise<PersistedOnboardingState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PersistedOnboardingState;
    if (!parsed?.finished || !parsed.mode || !Array.isArray(parsed.capabilities)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function persistOnboarding(state: PersistedOnboardingState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
