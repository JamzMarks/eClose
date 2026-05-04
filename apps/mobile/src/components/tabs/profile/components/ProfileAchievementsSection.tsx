import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { AppPalette } from "@/constants/palette";
import { Paddings, Radii } from "@/constants/layout";
import { buildProfileAchievementRows } from "@/lib/profile-achievement-rows";
import { LOCAL_MY_CALENDAR_EVENTS } from "@/services/my-calendar/my-calendar.local-data";
import type { ProfileUiDraft } from "@/types/profile-ui-draft.types";

export type ProfileAchievementsSectionProps = {
  draft: ProfileUiDraft;
  textColor: string;
  subtitleColor: string;
  borderColor: string;
  surfaceColor: string;
};

export function ProfileAchievementsSection({
  draft,
  textColor,
  subtitleColor,
  borderColor,
  surfaceColor,
}: ProfileAchievementsSectionProps) {
  const { t } = useTranslation("profile");
  const router = useRouter();

  const calendarActive = LOCAL_MY_CALENDAR_EVENTS.length > 0;

  const rows = useMemo(
    () => buildProfileAchievementRows(draft, calendarActive, t),
    [draft, calendarActive, t],
  );
  const unlocked = useMemo(() => rows.filter((r) => r.unlocked).length, [rows]);
  const total = rows.length;

  return (
    <View
      style={[
        styles.wrap,
        {
          borderColor,
          backgroundColor: surfaceColor,
        },
      ]}>
      <Text style={[styles.title, { color: textColor }]}>{t("profileAchievementsTitle")}</Text>
      <Text style={[styles.hint, { color: subtitleColor }]}>{t("profileAchievementsHint")}</Text>
      <Text style={[styles.progress, { color: textColor }]}>
        {t("profileAchievementsProgress", { unlocked, total })}
      </Text>
      <Pressable
        onPress={() => router.push("/profile-achievements")}
        accessibilityRole="button"
        accessibilityLabel={t("profileAchievementsExploreA11y")}
        style={({ pressed }) => [
          styles.link,
          {
            borderColor: AppPalette.primary,
            backgroundColor: pressed ? `${AppPalette.primary}22` : `${AppPalette.primary}10`,
          },
        ]}>
        <Text style={[styles.linkText, { color: AppPalette.primary }]}>{t("profileAchievementsExplore")}</Text>
        <Text style={[styles.chevron, { color: AppPalette.primary }]}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Paddings.md,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
  },
  progress: {
    fontSize: 14,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  link: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Paddings.sm,
    paddingHorizontal: Paddings.md,
    borderRadius: Radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  linkText: {
    fontSize: 15,
    fontWeight: "700",
  },
  chevron: {
    fontSize: 20,
    fontWeight: "300",
  },
});
