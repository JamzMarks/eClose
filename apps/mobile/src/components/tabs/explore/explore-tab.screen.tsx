import { useCallback, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/layout/screen";
import { AppTabScreenHeader } from "@/components/shared/tab-screen/AppTabScreenHeader";
import { TabScreenContent } from "@/components/shared/tab-screen/TabScreenContent";
import { ExploreFiltersSheet } from "@/components/tabs/explore/explore-filters-sheet";
import {
  applyExploreCityQuery,
  applyExploreMapFilters,
  DEFAULT_EXPLORE_MAP_FILTERS,
  isExploreMapFiltersAppDefault,
  type ExploreMapFilters,
} from "@/components/tabs/explore/explore-map-filters";
import { ExploreMapView } from "@/components/tabs/explore/explore-map-view";
import type { ExploreHotspot, ExploreMapData } from "@/types/entities/explore.types";
import { ExploreVenuesSheet } from "@/components/tabs/explore/explore-venues-sheet";
import { useExploreVenuesInViewport } from "@/components/tabs/explore/use-explore-venues-in-viewport";
import { ExpandableInlineSearch } from "@/components/ui";
import { Icon } from "@/components/ui/icon/icon";
import { AppIcon } from "@/components/ui/icon/icon.types";
import { Layout } from "@/constants/layout";
import { AppPalette, getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MapMarkerProvider } from "@/lib/maps";
import { distanceKm } from "@/lib/maps/map-geometry";
import { useTranslation } from "react-i18next";

/** Tab Explorar — mapa, pins por tipo de venue e painel inferior estilo Airbnb. */
export function ExploreTabScreen() {
  const { t } = useTranslation("explore");
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);
  const initialRegion = BARUERI_TEST_REGION;
  const venuesInRegion = useExploreVenuesInViewport();

  const [appliedFilters, setAppliedFilters] = useState<ExploreMapFilters>(DEFAULT_EXPLORE_MAP_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");

  const venuesFiltered = useMemo(() => {
    const byKind = applyExploreMapFilters(venuesInRegion, appliedFilters);
    return applyExploreCityQuery(byKind, cityQuery);
  }, [venuesInRegion, appliedFilters, cityQuery]);

  const hotspots = useMemo<ExploreHotspot[]>(
    () => [
      {
        id: "hotspot-barueri-alphaville",
        title: "Alphaville (Barueri)",
        latitude: -23.5027,
        longitude: -46.8489,
        radiusMeters: 750,
      },
      {
        id: "hotspot-barueri-centro",
        title: "Centro de Barueri",
        latitude: -23.5114,
        longitude: -46.8769,
        radiusMeters: 650,
      },
    ],
    [],
  );

  const mapData = useMemo<ExploreMapData>(
    () => ({
      pins: venuesFiltered,
      hotspots,
    }),
    [venuesFiltered, hotspots],
  );

  const hasActiveFilters = !isExploreMapFiltersAppDefault(appliedFilters);

  const [sheetIndex, setSheetIndex] = useState(1);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  const selectedHotspot = useMemo(
    () => (selectedHotspotId ? hotspots.find((h) => h.id === selectedHotspotId) ?? null : null),
    [hotspots, selectedHotspotId],
  );

  const venuesForSheet = useMemo(() => {
    if (!selectedHotspot) return venuesFiltered;
    const center = { latitude: selectedHotspot.latitude, longitude: selectedHotspot.longitude };
    const radiusKm = selectedHotspot.radiusMeters / 1000;
    return venuesFiltered.filter((v) => {
      const d = distanceKm(center, { latitude: v.latitude, longitude: v.longitude });
      return d <= radiusKm;
    });
  }, [selectedHotspot, venuesFiltered]);

  const onMarkerPress = useCallback((venueId: string) => {
    setSelectedHotspotId(null);
    setSelectedVenueId(venueId);
    setSheetIndex(2);
  }, []);

  const onHotspotPress = useCallback((hotspotId: string) => {
    setSelectedHotspotId(hotspotId);
    setSelectedVenueId(null);
    setSheetIndex(2);
  }, []);

  return (
    <MapMarkerProvider>
      <Screen>
        <AppTabScreenHeader
          borderColor={c.border}
          titleColor={c.text}
          layout="natural"
          titleAlign="left"
          center={
            <View style={styles.headerCenterRow} pointerEvents="box-none">
              <Text
                style={[styles.headerTitle, { color: c.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
                {...(Platform.OS === "android" ? { includeFontPadding: false } : {})}>
                {t("screenTitle")}
              </Text>
              <View style={styles.headerSearchSlot}>
                <ExpandableInlineSearch
                  expandToAvailableWidth
                  value={cityQuery}
                  onChangeText={setCityQuery}
                  placeholder={t("citySearchPlaceholder")}
                  expandAccessibilityLabel={t("citySearchExpandA11y")}
                  inputAccessibilityLabel={t("citySearchInputA11y")}
                  collapseAccessibilityLabel={t("citySearchCollapseA11y")}
                />
              </View>
            </View>
          }
          trailing={
            <Pressable
              onPress={() => setFiltersOpen(true)}
              hitSlop={12}
              style={styles.filterBtn}
              accessibilityRole="button"
              accessibilityLabel={t("filtersOpenA11y")}>
              <View>
                <Icon name={AppIcon.Filter} size="md" color={c.text} />
                {hasActiveFilters ? <View style={styles.filterBadge} /> : null}
              </View>
            </Pressable>
          }
        />
        <TabScreenContent edgeToEdge>
          <View style={styles.column}>
            <View style={[styles.mapHost, { backgroundColor: c.surface }]}>
              <ExploreMapView
                initialRegion={initialRegion}
                data={mapData}
                onMarkerPress={onMarkerPress}
                onHotspotPress={onHotspotPress}
              />
              <ExploreVenuesSheet
                venues={venuesForSheet}
                sheetIndex={sheetIndex}
                onSheetIndexChange={setSheetIndex}
                selectedVenueId={selectedVenueId}
                onSelectVenueId={setSelectedVenueId}
              />
            </View>
          </View>
        </TabScreenContent>
        <ExploreFiltersSheet
          visible={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          value={appliedFilters}
          onApply={setAppliedFilters}
        />
      </Screen>
    </MapMarkerProvider>
  );
}

const BARUERI_TEST_REGION = {
  latitude: -23.5114,
  longitude: -46.8769,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const styles = StyleSheet.create({
  headerCenterRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minWidth: 0,
    columnGap: Layout.tab.header.naturalGap,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 26,
    flexShrink: 1,
    minWidth: 0,
  },
  headerSearchSlot: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  column: {
    flex: 1,
  },
  mapHost: {
    flex: 1,
    position: "relative",
  },
  filterBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadge: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppPalette.primary,
  },
});
