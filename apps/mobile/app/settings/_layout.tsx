import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function SettingsLayout() {
  const { t } = useTranslation("settings");

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: t("title"),
      }}
    >
      <Stack.Screen name="index" options={{ title: t("title") }} />
      <Stack.Screen name="about" options={{ title: t("aboutScreenTitle") }} />
    </Stack>
  );
}
