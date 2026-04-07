import AsyncStorage from "@react-native-async-storage/async-storage";

type NotificationPrefsRecord = {
  completed: boolean;
  skipped: boolean;
};

function newKey(userId: string) {
  return `@eclose/account-setup/notification-prefs/${userId}`;
}

/** Chave antiga — lida uma vez para migrar. */
function legacyKey(userId: string) {
  return `@eclose/onboarding/notification-prefs/${userId}`;
}

const defaultRecord: NotificationPrefsRecord = {
  completed: false,
  skipped: false,
};

export async function loadAccountSetupNotificationPrefs(
  userId: string,
): Promise<NotificationPrefsRecord> {
  const primary = await AsyncStorage.getItem(newKey(userId));
  if (primary) {
    return parseRecord(primary);
  }
  const old = await AsyncStorage.getItem(legacyKey(userId));
  if (old) {
    const parsed = parseRecord(old);
    await AsyncStorage.setItem(newKey(userId), JSON.stringify(parsed));
    return parsed;
  }
  return { ...defaultRecord };
}

function parseRecord(raw: string): NotificationPrefsRecord {
  try {
    const parsed = JSON.parse(raw) as Partial<NotificationPrefsRecord>;
    return {
      completed: Boolean(parsed.completed),
      skipped: Boolean(parsed.skipped),
    };
  } catch {
    return { ...defaultRecord };
  }
}

export async function saveAccountSetupNotificationPrefsCompleted(userId: string): Promise<void> {
  const prev = await loadAccountSetupNotificationPrefs(userId);
  await AsyncStorage.setItem(newKey(userId), JSON.stringify({ ...prev, completed: true }));
}

export async function saveAccountSetupNotificationPrefsSkipped(userId: string): Promise<void> {
  const prev = await loadAccountSetupNotificationPrefs(userId);
  await AsyncStorage.setItem(newKey(userId), JSON.stringify({ ...prev, skipped: true }));
}
