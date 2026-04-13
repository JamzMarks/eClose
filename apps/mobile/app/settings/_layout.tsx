import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  buildMinimalStackHeaderOptions,
  minimalStackBackCircleBackground,
} from "@/components/navigation/minimal-stack-header";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function SettingsLayout() {
  const { t: tCommon } = useTranslation("common");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const isDark = scheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        ...buildMinimalStackHeaderOptions({
          headerBackgroundColor: c.background,
          tintColor: c.text,
          circleBackgroundColor: minimalStackBackCircleBackground(isDark ? "dark" : "light"),
          backAccessibilityLabel: tCommon("backA11y"),
        }),
      }}>
      <Stack.Screen name="index" options={{ title: "" }} />
      <Stack.Screen name="about" options={{ title: "" }} />
      <Stack.Screen name="account" options={{ title: "" }} />
      <Stack.Screen name="account/name" options={{ title: "" }} />
      <Stack.Screen name="account/email" options={{ title: "" }} />
      <Stack.Screen name="account/password" options={{ title: "" }} />
    </Stack>
  );
}
