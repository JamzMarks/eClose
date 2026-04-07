import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

import { AccountSetupProvider } from "@/features/account-setup";
import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const { t } = useTranslation("tabs");
  const colorScheme = useColorScheme();

  return (
    <AccountSetupProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={AppIcon.Home}
                size="lg"
                color={color}
                filled={focused}
              />
            ),
            tabBarAccessibilityLabel: t("home"),
          }}
        />

        <Tabs.Screen
          name="programacao"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={AppIcon.Programacao}
                size="lg"
                color={color}
                filled={focused}
              />
            ),
            tabBarAccessibilityLabel: t("programacao"),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={AppIcon.Create}
                size="lg"
                color={color}
                filled={focused}
              />
            ),
            tabBarAccessibilityLabel: t("createTab"),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={AppIcon.Explore}
                size="lg"
                color={color}
                filled={focused}
              />
            ),
            tabBarAccessibilityLabel: t("mapTab"),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={AppIcon.Profile}
                size="lg"
                color={color}
                filled={focused}
              />
            ),
            tabBarAccessibilityLabel: t("profile"),
          }}
        />
      </Tabs>
    </AccountSetupProvider>
  );
}
