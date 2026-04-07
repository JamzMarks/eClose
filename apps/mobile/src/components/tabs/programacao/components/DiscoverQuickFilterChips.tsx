import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { Radius } from "@/constants/radius";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type DiscoverQuickFilterId = "all" | "popular" | "recommends" | "more";

export type DiscoverQuickFilterChipsProps = {
  value: DiscoverQuickFilterId;
  onChange: (id: DiscoverQuickFilterId) => void;
  onMorePress: () => void;
};

export function DiscoverQuickFilterChips({ value, onChange, onMorePress }: DiscoverQuickFilterChipsProps) {
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const chips: { id: DiscoverQuickFilterId; label: string }[] = [
    { id: "all", label: t("quickFilterAll") },
    { id: "popular", label: t("quickFilterPopular") },
    { id: "recommends", label: t("quickFilterRecommends") },
    { id: "more", label: t("quickFilterMore") },
  ];

  return (
    <View style={[styles.track, { backgroundColor: scheme === "dark" ? c.surfaceElevated : "#E7E5E4" }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        {chips.map((chip) => {
          const selected = value === chip.id;
          const isMore = chip.id === "more";
          return (
            <Pressable
              key={chip.id}
              onPress={() => {
                if (isMore) {
                  onMorePress();
                  return;
                }
                onChange(chip.id);
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
                style={[
                  styles.chipText,
                  { color: selected && !isMore ? AppPalette.white : c.text },
                ]}
                numberOfLines={1}>
                {chip.label}
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
