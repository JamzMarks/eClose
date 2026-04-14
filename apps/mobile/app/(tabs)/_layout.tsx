import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const { t } = useTranslation("tabs");
  const { t: tExplore } = useTranslation("explore");
  const colorScheme = useColorScheme();

  return (
    <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIconStyle: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 0,
            marginBottom: 0,
          },
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 0,
            paddingBottom: 0,
          },
          tabBarLabelStyle: { display: "none" },
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
            tabBarAccessibilityLabel: tExplore("tabA11y"),
          }}
        />

        <Tabs.Screen
          name="chat"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={AppIcon.Chat}
                size="lg"
                color={color}
                filled={focused}
              />
            ),
            tabBarAccessibilityLabel: t("chatTab"),
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
  );
}
