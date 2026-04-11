import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

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
