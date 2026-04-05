import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Tab Mapa — `react-native-maps` foi removido por instabilidade; mapa interactivo volta quando
 * reinstalarmos a lib (ou alternativa). O bloco comentado em baixo é referência do layout anterior.
 */
export function ExploreMapTabScreen() {
  const { t } = useTranslation("discover");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  return (
    <Screen>
      <AppTabScreenHeader
        title={t("mapExploreTitle")}
        subtitle={t("mapExploreSubtitle")}
        borderColor={c.border}
        titleColor={c.text}
        subtitleColor={c.textSecondary}
      />
      <View style={[styles.mockArea, { backgroundColor: c.surface }]}>
        <Text style={[styles.mockTitle, { color: c.text }]}>{t("mapTabPlaceholderTitle")}</Text>
        <Text style={[styles.mockBody, { color: c.textSecondary }]}>{t("mapTabPlaceholderBody")}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mockArea: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 24,
    justifyContent: "center",
  },
  mockTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  mockBody: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});

/*
 * --- Mock / referência para quando `react-native-maps` voltar a estar nas dependências ---
 *
 * import { useState } from "react";
 * import MapView, { Marker, type Region } from "react-native-maps";
 * import { ExploreMapResultsSheet } from "./ExploreMapResultsSheet";
 * import { PORTUGAL_INITIAL_REGION } from "./explore-map-region";
 * import { useExploreMapRegionResults } from "./use-explore-map-region-results";
 *
 * const [region, setRegion] = useState<Region>(PORTUGAL_INITIAL_REGION);
 * const [sheetOpen, setSheetOpen] = useState(false);
 * const { markers, rows } = useExploreMapRegionResults(region);
 *
 * <MapView
 *   style={{ flex: 1 }}
 *   region={region}
 *   onRegionChangeComplete={setRegion}>
 *   {markers.map((m) => (
 *     <Marker key={m.id} coordinate={m.coordinate} title={m.title} />
 *   ))}
 * </MapView>
 *
 * <ExploreMapResultsSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} rows={rows} ... />
 */
