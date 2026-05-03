import { useCallback, useMemo } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ListRenderItemInfo,
} from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { ExploreVenueCard } from "@/components/tabs/explore/explore-venue-card";
import type { ExploreVenuePin } from "@/types/entities/explore.types";
import { Paddings, Radii } from "@/constants/layout";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ExploreVenuesSheetProps = {
  venues: ExploreVenuePin[];
  sheetIndex: number;
  onSheetIndexChange: (index: number) => void;
  selectedVenueId: string | null;
  onSelectVenueId: (id: string | null) => void;
};

const NUM_COLUMNS = 2;

/**
 * Painel inferior estilo Airbnb: nunca fecha por completo (`enablePanDownToClose={false}`),
 * arrasta entre picos; grelha 2 colunas com scroll vertical.
 */
export function ExploreVenuesSheet({
  venues,
  sheetIndex,
  onSheetIndexChange,
  selectedVenueId,
  onSelectVenueId,
}: ExploreVenuesSheetProps) {
  const { t } = useTranslation("explore");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { height: windowH } = useWindowDimensions();

  const snapPoints = useMemo(() => ["14%", "42%", "88%"], []);

  const headerTitle = t("sheetTitle");
  const countLabel = t("sheetCount", { count: venues.length });

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ExploreVenuePin>) => (
      <View style={styles.gridCell}>
        <ExploreVenueCard
          variant="grid"
          venue={item}
          selected={selectedVenueId === item.id}
          onPress={() => onSelectVenueId(item.id)}
        />
      </View>
    ),
    [onSelectVenueId, selectedVenueId],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.sheetHeader}>
        <Text style={[styles.sheetTitle, { color: c.text }]}>{headerTitle}</Text>
        <Text style={[styles.sheetMeta, { color: c.textSecondary }]}>{countLabel}</Text>
      </View>
    ),
    [c.text, c.textSecondary, countLabel, headerTitle, venues.length],
  );

  const listEmpty = useMemo(
    () => (
      <Text style={[styles.empty, { color: c.textSecondary, paddingHorizontal: Paddings.xl }]}>
        {t("sheetEmpty")}
      </Text>
    ),
    [c.textSecondary, t],
  );

  const webPanelHeight = Math.min(Math.round(windowH * 0.58), 620);

  if (Platform.OS === "web") {
    return (
      <View
        style={[
          styles.webPanel,
          {
            height: webPanelHeight,
            backgroundColor: c.background,
            borderTopColor: c.border,
            paddingBottom: insets.bottom + 8,
          },
        ]}>
        <FlatList
          data={venues}
          keyExtractor={(v) => v.id}
          numColumns={NUM_COLUMNS}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          columnWrapperStyle={styles.columnRow}
          contentContainerStyle={styles.gridContent}
          style={styles.listFlex}
          showsVerticalScrollIndicator
          nestedScrollEnabled
        />
      </View>
    );
  }

  return (
    <BottomSheet
      index={sheetIndex}
      onChange={onSheetIndexChange}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      enableOverDrag={false}
      animateOnMount
      backgroundStyle={{
        backgroundColor: c.background,
        borderTopLeftRadius: Radii.xl,
        borderTopRightRadius: Radii.xl,
      }}
      handleIndicatorStyle={{ backgroundColor: c.border, width: 42 }}>
      <BottomSheetFlatList
        data={venues}
        keyExtractor={(v: ExploreVenuePin) => v.id}
        numColumns={NUM_COLUMNS}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        columnWrapperStyle={styles.columnRow}
        contentContainerStyle={[styles.gridContent, { paddingBottom: insets.bottom + Paddings.lg }]}
        style={styles.listFlex}
        showsVerticalScrollIndicator
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetHeader: {
    paddingHorizontal: Paddings.xl,
    paddingBottom: Paddings.md,
    gap: 4,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sheetMeta: {
    fontSize: 14,
  },
  listFlex: {
    flex: 1,
  },
  gridContent: {
    paddingBottom: Paddings.md,
    flexGrow: 1,
  },
  columnRow: {
    paddingHorizontal: Paddings.xl,
    gap: Paddings.md,
    marginBottom: Paddings.md,
  },
  gridCell: {
    flex: 1,
    minWidth: 0,
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    paddingVertical: Paddings.lg,
  },
  webPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
});
