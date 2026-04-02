import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { SettingsModalScreen } from "@/components/settings/settings-modal.screen";

export default function SettingsRoute() {
  const { t } = useTranslation("settings");

  return (
    <>
      <Stack.Screen options={{ title: t("title") }} />
      <SettingsModalScreen />
    </>
  );
}
