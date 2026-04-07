import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function CreateStackLayout() {
  const { t } = useTranslation("discover");

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Voltar",
        headerShown: true,
      }}>
      <Stack.Screen name="event" options={{ title: t("createEventScreenTitle") }} />
      <Stack.Screen name="venue" options={{ title: t("createVenueScreenTitle") }} />
    </Stack>
  );
}
