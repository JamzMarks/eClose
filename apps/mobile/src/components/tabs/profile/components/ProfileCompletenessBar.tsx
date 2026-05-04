import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Radii } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ProfileCompletenessBarProps = {
  percent: number;
  borderColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  onPressEdit: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ProfileCompletenessBar({
  percent,
  borderColor,
  surfaceColor,
  textColor,
  mutedColor,
  onPressEdit,
  style,
}: ProfileCompletenessBarProps) {
  const { t } = useTranslation("profile");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const fillWidth = `${clamped}%` as const;

  return (
    <View style={[styles.wrap, { borderColor, backgroundColor: surfaceColor }, style]}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: textColor }]}>{t("profileCompletenessTitle")}</Text>
        <Text style={[styles.percent, { color: AppPalette.primary }]}>{t("profileCompletenessPercent", { percent: clamped })}</Text>
      </View>
      <View style={[styles.track, { backgroundColor: c.border }]}>
        <View style={[styles.fill, { width: fillWidth, backgroundColor: AppPalette.primary }]} />
      </View>
      <Text style={[styles.hint, { color: mutedColor }]}>{t("profileCompletenessHint")}</Text>
      <Pressable
        onPress={onPressEdit}
        accessibilityRole="button"
        accessibilityLabel={t("profileEditProfile")}
        style={({ pressed }) => [
          styles.cta,
          { borderColor: AppPalette.primary, backgroundColor: `${AppPalette.primary}14` },
          pressed && styles.pressed,
        ]}>
        <Text style={[styles.ctaText, { color: AppPalette.primary }]}>{t("profileEditProfile")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
  },
  percent: {
    fontSize: 14,
    fontWeight: "700",
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
  },
  cta: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: { opacity: 0.9 },
});
