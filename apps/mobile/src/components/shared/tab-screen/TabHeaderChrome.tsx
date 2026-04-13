import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { AppPressable } from "@/components/ui/Pressable";
import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";

export function TabHeaderCreateButton({ color }: { color: string }) {
  const router = useRouter();
  const { t } = useTranslation("tabs");
  return (
    <Pressable
      onPress={() => router.push("/create")}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={t("tabHeaderCreateA11y")}>
      <Icon name={AppIcon.Create} size="lg" color={color} filled />
    </Pressable>
  );
}

export function TabHeaderNotificationsButton({ color }: { color: string }) {
  const router = useRouter();
  const { t } = useTranslation("tabs");
  return (
    <Pressable
      onPress={() => router.push("/notifications")}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={t("tabHeaderNotificationsA11y")}>
      <Icon name={AppIcon.Notifications} size="lg" color={color} />
    </Pressable>
  );
}

export function TabHeaderChatNewButton({ color }: { color: string }) {
  const router = useRouter();
  const { t } = useTranslation("tabs");
  return (
    // <AppPressable
    //   icon={AppIcon.Edit}
    //   color={color}
    //   onPress={() => router.push("/chat-new")}
    //   hitSlop={12}
    //   accessibilityLabel={t("chatNewMessageA11y")}
    // />
    <Pressable
      onPress={() => router.push("/chat-new")}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={t("chatNewMessageA11y")}>
      <Icon name={AppIcon.Edit} size="lg" color={color} />
    </Pressable>
  );
}

export function TabHeaderSettingsButton({ color }: { color: string }) {
  const router = useRouter();
  const { t } = useTranslation("tabs");
  return (
    <Pressable
      onPress={() => router.push("/settings")}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={t("tabHeaderSettingsA11y")}>
      <Icon name={AppIcon.Settings} size="lg" color={color} />
    </Pressable>
  );
}
