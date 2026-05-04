import { Platform, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { getSchemeColors } from "@/constants/palette";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

/** Altura útil da barra (acima do home indicator / gestos); ícones centrados nessa faixa. */
const TAB_BAR_CONTENT_HEIGHT = Platform.select({ ios: 48, default: 56 });

export default function TabLayout() {
  const { t } = useTranslation("tabs");
  const { t: tExplore } = useTranslation("explore");
  const colorScheme = useColorScheme();
  const scheme = colorScheme ?? "light";
  const c = getSchemeColors(scheme);
  const insets = useSafeAreaInsets();

  return (
    <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[scheme].tint,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIconStyle: {
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 0,
            paddingBottom: 0,
          },
          tabBarLabelStyle: { display: "none" },
          tabBarStyle: {
            backgroundColor: Colors[scheme].background,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: c.border,
            elevation: 0,
            height: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
            paddingTop: 0,
            paddingBottom: insets.bottom,
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
          name="discover"
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
