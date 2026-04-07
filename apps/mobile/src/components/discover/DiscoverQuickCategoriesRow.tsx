import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppPalette, getSchemeColors } from "@/constants/palette";
import { Radius } from "@/constants/radius";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  getDiscoverQuickCategories,
  type DiscoverQuickCategory,
} from "@/services/discover/discover-quick-categories.mock";

export type DiscoverQuickCategoriesRowProps = {
  selectedId: string | null;
  onSelect: (cat: DiscoverQuickCategory | null) => void;
};

const CARD_W = 76;
const CARD_H = 86;

export function DiscoverQuickCategoriesRow({ selectedId, onSelect }: DiscoverQuickCategoriesRowProps) {
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<DiscoverQuickCategory[]>([]);
  const [seeAllOpen, setSeeAllOpen] = useState(false);

  useEffect(() => {
    void getDiscoverQuickCategories().then(setItems);
  }, []);

  const visible = items.slice(0, 5);

  return (
    <>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: c.text }]}>{t("quickCategoriesTitle")}</Text>
        <Pressable onPress={() => setSeeAllOpen(true)} hitSlop={8} accessibilityRole="button">
          <Text style={[styles.seeAll, { color: AppPalette.primary }]}>{t("quickCategoriesSeeAll")}</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {visible.map((cat) => {
          const selected = selectedId === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelect(selected ? null : cat)}
              style={({ pressed }) => [
                styles.card,
                {
                  width: CARD_W,
                  height: CARD_H,
                  backgroundColor: selected ? AppPalette.primaryMuted : c.surface,
                  borderColor: selected ? AppPalette.primary : c.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t(cat.labelKey)}
              accessibilityState={{ selected }}>
              <Text style={styles.emoji}>{cat.emoji}</Text>
              <Text style={[styles.cardLabel, { color: c.text }]} numberOfLines={2}>
                {t(cat.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Modal visible={seeAllOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSeeAllOpen(false)}>
        <View style={[styles.modalRoot, { backgroundColor: c.background, paddingTop: insets.top + 8 }]}>
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
                  <Text style={[styles.cardLabel, { color: c.text }]}>{t(cat.labelKey)}</Text>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  seeAll: {
    fontSize: 15,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 6,
  },
  card: {
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
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
