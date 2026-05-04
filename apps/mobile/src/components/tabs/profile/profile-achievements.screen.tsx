import { useLayoutEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/layout/screen";
import { Icon } from "@/components/ui/icon/icon";
import { Paddings, Radii } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useProfileUiDraft } from "@/hooks/use-profile-ui-draft";
import { buildProfileAchievementRows } from "@/lib/profile-achievement-rows";
import { LOCAL_MY_CALENDAR_EVENTS } from "@/services/my-calendar/my-calendar.local-data";

export function ProfileAchievementsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation("profile");
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const { draft } = useProfileUiDraft();

  const calendarActive = LOCAL_MY_CALENDAR_EVENTS.length > 0;

  const rows = useMemo(
    () => buildProfileAchievementRows(draft, calendarActive, t),
    [draft, calendarActive, t],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("profileAchievementsScreenTitle"),
    });
  }, [navigation, t]);

  return (
    <Screen edges={["bottom"]}>
      <ScrollView
        style={[styles.flex, { backgroundColor: c.background }]}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Paddings.xl },
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.lead, { color: c.textSecondary }]}>{t("profileAchievementsHint")}</Text>
        <View style={styles.grid}>
          {rows.map((row) => (
            <View
              key={row.key}
              style={[
                styles.tile,
                {
                  borderColor: row.unlocked ? `${AppPalette.primary}66` : c.border,
                  backgroundColor: c.surface,
                  opacity: row.unlocked ? 1 : 0.55,
                },
              ]}>
              <View style={styles.tileHead}>
                <Icon
                  name={row.icon}
                  size="md"
                  color={row.unlocked ? AppPalette.primary : c.textSecondary}
                />
                <Text style={[styles.tileTitle, { color: c.text }]} numberOfLines={2}>
                  {row.title}
                </Text>
              </View>
              <Text style={[styles.tileDesc, { color: c.textSecondary }]} numberOfLines={4}>
                {row.desc}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: Paddings.xl,
    paddingTop: Paddings.md,
    gap: Paddings.md,
  },
  lead: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Paddings.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Paddings.sm,
  },
  tile: {
    width: "47%",
    minWidth: 148,
    flexGrow: 1,
    borderRadius: Radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Paddings.md,
    gap: Paddings.sm,
  },
  tileHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: Paddings.sm,
  },
  tileTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
  },
  tileDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
});
