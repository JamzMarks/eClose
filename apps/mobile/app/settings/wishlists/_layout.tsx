import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  buildMinimalStackHeaderOptions,
  minimalStackBackCircleBackground,
} from "@/components/navigation/minimal-stack-header";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function SettingsWishlistsLayout() {
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
      <Stack.Screen name="[id]" options={{ title: "" }} />
    </Stack>
  );
}
