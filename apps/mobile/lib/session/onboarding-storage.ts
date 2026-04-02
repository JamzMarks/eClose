import AsyncStorage from "@react-native-async-storage/async-storage";

type PrefsOnboardingRecord = {
  completed: boolean;
  skipped: boolean;
};

function key(userId: string) {
  return `@eclose/onboarding/notification-prefs/${userId}`;
}

const defaultRecord: PrefsOnboardingRecord = {
  completed: false,
  skipped: false,
};

export async function loadPrefsOnboardingState(
  userId: string,
): Promise<PrefsOnboardingRecord> {
  const raw = await AsyncStorage.getItem(key(userId));
  if (!raw) return { ...defaultRecord };
  try {
    const parsed = JSON.parse(raw) as Partial<PrefsOnboardingRecord>;
    return {
      completed: Boolean(parsed.completed),
      skipped: Boolean(parsed.skipped),
    };
  } catch {
    return { ...defaultRecord };
  }
}

export async function savePrefsOnboardingCompleted(userId: string): Promise<void> {
  const prev = await loadPrefsOnboardingState(userId);
  await AsyncStorage.setItem(
    key(userId),
    JSON.stringify({ ...prev, completed: true }),
  );
}

export async function savePrefsOnboardingSkipped(userId: string): Promise<void> {
  const prev = await loadPrefsOnboardingState(userId);
  await AsyncStorage.setItem(
    key(userId),
    JSON.stringify({ ...prev, skipped: true }),
  );
}
