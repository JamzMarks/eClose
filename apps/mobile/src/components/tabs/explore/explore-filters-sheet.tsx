import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import {
  DEFAULT_EXPLORE_MAP_FILTERS,
  EXPLORE_FILTER_KIND_ORDER,
  EXPLORE_MAP_FILTERS_SHOW_ALL,
  type ExploreMapFilters,
} from "@/components/tabs/explore/explore-map-filters";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { VenueMarkerKind } from "@/lib/maps/marker-registry.types";
import { Paddings, Radii } from "@/constants/layout";
import { useTranslation } from "react-i18next";

export type ExploreFiltersSheetProps = {
  visible: boolean;
  onClose: () => void;
  value: ExploreMapFilters;
  onApply: (next: ExploreMapFilters) => void;
};

export function ExploreFiltersSheet({ visible, onClose, value, onApply }: ExploreFiltersSheetProps) {
  const { t } = useTranslation("explore");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["62%", "88%"], []);

  const [draft, setDraft] = useState<ExploreMapFilters>(value);

  useEffect(() => {
    if (visible) {
      setDraft({ venueKinds: [...value.venueKinds] });
    }
  }, [visible, value]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
        pressBehavior="close"
      />
    ),
    [],
  );

  const toggleKind = useCallback((kind: VenueMarkerKind) => {
    setDraft((prev) => {
      const set = new Set(prev.venueKinds);
      if (set.has(kind)) {
        set.delete(kind);
      } else {
        set.add(kind);
      }
      return { venueKinds: Array.from(set) };
    });
  }, []);

  const selectAllKinds = useCallback(() => {
    // Garante update mesmo quando já está em "all".
    setDraft({ venueKinds: [...EXPLORE_MAP_FILTERS_SHOW_ALL.venueKinds] });
  }, []);

  const reset = useCallback(() => {
    // Garante update e evita partilhar referências.
    setDraft({ venueKinds: [...DEFAULT_EXPLORE_MAP_FILTERS.venueKinds] });
  }, []);

  const apply = useCallback(() => {
    onApply(draft);
    onClose();
  }, [draft, onApply, onClose]);

  const allSelectedVisually = draft.venueKinds.length === 0;

  return (
    <BottomSheet
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={(i) => {
        if (i === -1) onClose();
      }}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: c.surface }}
      handleIndicatorStyle={{ backgroundColor: c.border }}>
      <BottomSheetScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: c.text }]}>{t("filtersTitle")}</Text>
        <Text style={[styles.lead, { color: c.textSecondary }]}>{t("filtersLead")}</Text>

        <Text style={[styles.section, { color: c.textSecondary }]}>{t("filtersKindSection")}</Text>
        <Pressable
          onPress={selectAllKinds}
          style={({ pressed }) => [
            styles.chip,
            {
              borderColor: allSelectedVisually ? AppPalette.primary : c.border,
              backgroundColor: allSelectedVisually ? `${AppPalette.primary}18` : "transparent",
            },
            pressed && styles.chipPressed,
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: allSelectedVisually }}
          accessibilityLabel={t("filtersAllKindsA11y")}>
          <Text
            style={{
              color: allSelectedVisually ? AppPalette.primary : c.text,
              fontWeight: "700",
              fontSize: 14,
            }}>
            {t("filtersAllKinds")}
          </Text>
        </Pressable>

        <View style={styles.chipGrid}>
          {EXPLORE_FILTER_KIND_ORDER.map((kind) => {
            const selected =
              draft.venueKinds.length > 0 && draft.venueKinds.includes(kind);
            return (
              <Pressable
                key={kind}
                onPress={() => toggleKind(kind)}
                style={({ pressed }) => [
                  styles.chip,
                  styles.chipHalf,
                  {
                    borderColor: selected ? AppPalette.primary : c.border,
                    backgroundColor: selected ? `${AppPalette.primary}18` : "transparent",
                  },
                  pressed && styles.chipPressed,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={t(`markers.${kind}`)}>
                <Text
                  style={{
                    color: selected ? AppPalette.primary : c.text,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                  numberOfLines={1}>
                  {t(`markers.${kind}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={reset}
            style={({ pressed }) => [styles.secondaryBtn, { borderColor: c.border }, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
            accessibilityLabel={t("filtersResetA11y")}>
            <Text style={[styles.secondaryBtnText, { color: c.text }]}>{t("filtersReset")}</Text>
          </Pressable>
          <Pressable
            onPress={apply}
            style={({ pressed }) => [styles.primaryBtn, { backgroundColor: AppPalette.primary }, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel={t("filtersApplyA11y")}>
            <Text style={styles.primaryBtnText}>{t("filtersApply")}</Text>
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Paddings.xl,
    paddingTop: Paddings.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  lead: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Paddings.lg,
  },
  section: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: Paddings.sm,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Paddings.sm,
    marginTop: Paddings.sm,
    marginBottom: Paddings.xl,
  },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radii.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 0,
  },
  chipHalf: {
    minWidth: "47%",
    flexGrow: 1,
    maxWidth: "48%",
  },
  chipPressed: {
    opacity: 0.88,
  },
  actions: {
    flexDirection: "row",
    gap: Paddings.md,
    marginTop: Paddings.sm,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radii.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryBtn: {
    flex: 1,
    borderRadius: Radii.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
