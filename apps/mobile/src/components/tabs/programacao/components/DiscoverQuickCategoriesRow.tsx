import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { Radius } from "@/constants/layout";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  getDiscoverQuickCategories,
  type DiscoverQuickCategory,
  type DiscoverQuickCategoryListKind,
} from "@/services/discover/discover-quick-categories.mock";

export type DiscoverQuickCategoriesRowProps = {
  listKind: DiscoverQuickCategoryListKind;
  selectedId: string | null;
  onSelect: (cat: DiscoverQuickCategory | null) => void;
};

const CARD_MIN_H = 92;

function useCategoryRowLayout(listLength: number) {
  const { width } = useWindowDimensions();
  /** Número de células na fila (tipicamente 4; ecrãs estreitos 3). */
  const slotCount = width < 360 ? 3 : 4;
  const needsMoreTile = listLength > slotCount;
  const categorySlots = needsMoreTile ? Math.max(1, slotCount - 1) : Math.min(slotCount, listLength);
  return { slotCount, needsMoreTile, categorySlots };
}

function categoryLabel(cat: DiscoverQuickCategory, t: (k: string) => string): string {
  const fromApi = cat.label?.trim();
  if (fromApi) return fromApi;
  return t(cat.labelKey);
}

export function DiscoverQuickCategoriesRow({
  listKind,
  selectedId,
  onSelect,
}: DiscoverQuickCategoriesRowProps) {
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<DiscoverQuickCategory[]>([]);
  const [seeAllOpen, setSeeAllOpen] = useState(false);

  useEffect(() => {
    void getDiscoverQuickCategories(listKind).then(setItems);
  }, [listKind]);

  const { needsMoreTile, categorySlots } = useCategoryRowLayout(items.length);

  const visibleCategories = useMemo(
    () => items.slice(0, needsMoreTile ? categorySlots : items.length),
    [items, needsMoreTile, categorySlots],
  );

  return (
    <>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: c.text }]}>{t("quickCategoriesTitle")}</Text>
      </View>
      <View style={styles.row}>
        {visibleCategories.map((cat) => {
          const selected = selectedId === cat.id;
          const label = categoryLabel(cat, t);
          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelect(selected ? null : cat)}
              style={({ pressed }) => [
                styles.card,
                styles.cardFlex,
                {
                  minHeight: CARD_MIN_H,
                  backgroundColor: selected ? AppPalette.primaryMuted : c.surface,
                  borderColor: selected ? AppPalette.primary : c.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected }}>
              <Text style={styles.emoji}>{cat.emoji}</Text>
              <Text style={[styles.cardLabel, { color: c.text }]} numberOfLines={2}>
                {label}
              </Text>
            </Pressable>
          );
        })}
        {needsMoreTile ? (
          <Pressable
            onPress={() => setSeeAllOpen(true)}
            style={({ pressed }) => [
              styles.card,
              styles.cardFlex,
              styles.moreCard,
              {
                minHeight: CARD_MIN_H,
                backgroundColor: scheme === "dark" ? c.surfaceElevated : c.surface,
                borderColor: c.border,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={t("quickCategoriesMoreA11y")}>
            <Text style={[styles.moreGlyph, { color: AppPalette.primary }]}>+</Text>
            <Text style={[styles.cardLabel, { color: c.text }]} numberOfLines={2}>
              {t("quickCategoriesMore")}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <Modal visible={seeAllOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSeeAllOpen(false)}>
        <View style={[styles.modalRoot, { backgroundColor: c.surface, paddingTop: insets.top + 8 }]}>
          <View style={[styles.modalHeader, { borderBottomColor: c.border }]}>
            <View style={styles.modalHeaderSide}>
              <Pressable onPress={() => setSeeAllOpen(false)} hitSlop={12}>
                <Text style={[styles.modalClose, { color: AppPalette.primary }]}>{t("quickCategoriesModalClose")}</Text>
              </Pressable>
            </View>
            <Text style={[styles.modalTitle, { color: c.text }]} numberOfLines={1}>
              {t("quickCategoriesTitle")}
            </Text>
            <View style={styles.modalHeaderSide} />
          </View>
          <ScrollView contentContainerStyle={styles.modalGrid} keyboardShouldPersistTaps="handled">
            {items.map((cat) => {
              const selected = selectedId === cat.id;
              const label = categoryLabel(cat, t);
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => {
                    onSelect(selected ? null : cat);
                    setSeeAllOpen(false);
                  }}
                  style={[
                    styles.modalCard,
                    {
                      backgroundColor: selected ? AppPalette.primaryMuted : c.surface,
                      borderColor: selected ? AppPalette.primary : c.border,
                    },
                  ]}>
                  <Text style={styles.emoji}>{cat.emoji}</Text>
                  <Text style={[styles.cardLabel, { color: c.text }]}>{label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  cardFlex: {
    flex: 1,
    minWidth: 0,
  },
  card: {
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  moreCard: {
    borderStyle: "dashed",
  },
  moreGlyph: {
    fontSize: 28,
    fontWeight: "300",
    lineHeight: 32,
  },
  emoji: {
    fontSize: 26,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  modalRoot: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalHeaderSide: {
    flex: 1,
  },
  modalClose: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalTitle: {
    flex: 2,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  modalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  modalCard: {
    width: "30%",
    minWidth: 100,
    flexGrow: 1,
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
  },
});
