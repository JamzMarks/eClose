import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

/** Conteúdo abaixo do cabeçalho do perfil: agenda, locais guardados, conquistas (máx. 3). */
export type ProfileContentTab = "calendar" | "places" | "achievements";

export type ProfileMediaTabStripProps = {
  activeTab: ProfileContentTab;
  onTabChange: (tab: ProfileContentTab) => void;
  textColor: string;
  mutedColor: string;
  borderColor: string;
};

const TABS: {
  id: ProfileContentTab;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "calendar", icon: "calendar-outline" },
  { id: "places", icon: "location-outline" },
  { id: "achievements", icon: "trophy-outline" },
];

export function ProfileMediaTabStrip({
  activeTab,
  onTabChange,
  textColor,
  mutedColor,
  borderColor,
}: ProfileMediaTabStripProps) {
  const { t } = useTranslation("profile");

  const a11y = (id: ProfileContentTab) => {
    switch (id) {
      case "calendar":
        return t("profileTabCalendarA11y");
      case "places":
        return t("profileTabPlacesA11y");
      case "achievements":
        return t("profileTabAchievementsA11y");
      default:
        return "";
    }
  };

  return (
    <View style={[styles.tabBar, { borderTopColor: borderColor }]}>
      {TABS.map(({ id, icon }) => {
        const active = activeTab === id;
        return (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityLabel={a11y(id)}
            accessibilityState={{ selected: active }}
            hitSlop={8}
            onPress={() => onTabChange(id)}
            style={styles.tab}>
            <Ionicons name={icon} size={22} color={active ? textColor : mutedColor} />
            <View
              style={[
                styles.underline,
                { backgroundColor: active ? textColor : "transparent" },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "stretch",
    marginTop: 16,
    marginHorizontal: -16,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 8,
    gap: 8,
    opacity: 1,
  },
  underline: {
    width: 28,
    height: 2,
    borderRadius: 1,
  },
});
