import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { Radius } from "@/constants/layout";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { ProgramacaoTimeQuickId, ProgramacaoTimeQuickSelection } from "../programacao-date-presets";

export type ProgramacaoTimeQuickChipsProps = {
  value: ProgramacaoTimeQuickSelection;
  onChange: (id: ProgramacaoTimeQuickId) => void;
  onMorePress: () => void;
};

const ROW_IDS: ProgramacaoTimeQuickId[] = ["all", "today", "weekend", "online", "more"];

export function ProgramacaoTimeQuickChips({ value, onChange, onMorePress }: ProgramacaoTimeQuickChipsProps) {
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const label = (id: ProgramacaoTimeQuickId) => {
    switch (id) {
      case "all":
        return t("programacaoQuickAll");
      case "today":
        return t("programacaoQuickToday");
      case "weekend":
        return t("programacaoQuickWeekend");
      case "online":
        return t("programacaoQuickOnline");
      case "more":
        return t("quickFilterMore");
      default:
        return "";
    }
  };

  return (
    <View style={[styles.track, { backgroundColor: scheme === "dark" ? c.surfaceElevated : "#E7E5E4" }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        {ROW_IDS.map((id) => {
          const selected = value !== "unset" && value === id;
          const isMore = id === "more";
          return (
            <Pressable
              key={id}
              onPress={() => {
                if (isMore) {
                  onMorePress();
                  return;
                }
                onChange(id);
              }}
              style={[
                styles.chip,
                {
                  backgroundColor: selected && !isMore ? AppPalette.primary : c.surface,
                  borderColor: selected && !isMore ? AppPalette.primary : c.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: selected && !isMore }}>
              <Text
                style={[styles.chipText, { color: selected && !isMore ? AppPalette.white : c.text }]}
                numberOfLines={1}>
                {label(id)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    marginHorizontal: 0,
    marginTop: 10,
    marginBottom: 22,
    paddingVertical: 12,
    borderRadius: Radius.medium,
  },
  scroll: {
    paddingHorizontal: 14,
    gap: 10,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
