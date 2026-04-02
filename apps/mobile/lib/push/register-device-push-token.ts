import { Platform } from "react-native";
import Constants from "expo-constants";

import { PushTokensService } from "@/infrastructure/api/user/push-tokens.service";

/**
 * Obtém token Expo Push, junta à lista no servidor (PATCH).
 * Em web ou sem permissão, sai em silêncio. Expo Go Android (SDK 53+) pode não suportar push.
 */
export async function registerDevicePushToken(): Promise<void> {
  if (Platform.OS === "web") return;

  try {
    const Notifications = await import("expo-notifications");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const { status: existing } = await Notifications.getPermissionsAsync();
    let next = existing;
    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      next = status;
    }
    if (next !== "granted") return;

    const projectId =
      (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)
        ?.eas?.projectId ??
      Constants.easConfig?.projectId;

    const expoToken = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    const token = expoToken.data?.trim();
    if (!token) return;

    const svc = new PushTokensService();
    const current = await svc.getMine();
    if (current.includes(token)) return;
    const merged = [...new Set([...current, token])];
    await svc.patchMine(merged);
  } catch {
    /* sem credenciais push / Expo Go — não bloquear app */
  }
}
