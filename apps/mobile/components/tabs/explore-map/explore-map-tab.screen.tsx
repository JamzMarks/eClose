import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Region } from "react-native-maps";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { ExploreMapResultsModal } from "./ExploreMapResultsModal";
import { ExploreMapView } from "./ExploreMapView";
import { PORTUGAL_INITIAL_REGION } from "./explore-map-region";
import { useExploreMapRegionResults } from "./use-explore-map-region-results";

/**
 * Explorar no mapa: este ecrã mantém região, resultados na viewport e modais;
 * o mapa em si é filho (`ExploreMapView`) para não misturar localização com desenho.
 */
export function ExploreMapTabScreen() {
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  const [region, setRegion] = useState<Region>(PORTUGAL_INITIAL_REGION);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { markers, rows } = useExploreMapRegionResults(region);

  return (
    <Screen>
      <View style={[styles.toolbar, { borderBottomColor: c.border, backgroundColor: c.background }]}>
        <View style={styles.toolbarText}>
          <Text style={[styles.title, { color: c.text }]}>{t("mapExploreTitle")}</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>{t("mapExploreSubtitle")}</Text>
        </View>
        <Pressable
          onPress={() => setSheetOpen(true)}
          style={[styles.listBtn, { backgroundColor: AppPalette.primary }]}
          accessibilityRole="button"
          accessibilityLabel={t("mapOpenListA11y", { count: rows.length })}>
          <Text style={styles.listBtnText}>{t("mapOpenList", { count: rows.length })}</Text>
        </Pressable>
      </View>
      <ExploreMapView
        style={styles.map}
        region={region}
        markers={markers}
        onRegionChangeComplete={setRegion}
        webFallbackMessage={t("mapWebFallback")}
      />
      <ExploreMapResultsModal
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        rows={rows}
        title={t("mapResultsTitle")}
        emptyMessage={t("mapEmptyRegion")}
        onlineLabel={t("online")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toolbarText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  listBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  listBtnText: {
    color: AppPalette.white,
    fontWeight: "700",
    fontSize: 14,
  },
  map: {
    flex: 1,
  },
});
