import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function WishlistsLayout() {
  const { t } = useTranslation("wishlists");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  return (
    <Stack
      screenOptions={{
        headerTintColor: AppPalette.primary,
        headerStyle: { backgroundColor: c.surface },
        headerTitleStyle: { color: c.text },
        headerBackTitle: "Voltar",
      }}>
      <Stack.Screen name="index" options={{ title: t("title") }} />
      <Stack.Screen name="[id]" options={{ title: t("detailTitle") }} />
    </Stack>
  );
}
