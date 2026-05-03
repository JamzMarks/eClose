import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import type { ExploreMapData } from "@/types/entities/explore.types";
import { useMapViewport } from "@/lib/maps/map-provider";
import type { MapRegion } from "@/lib/maps/types";

export type ExploreMapViewProps = {
  initialRegion: MapRegion;
  data: ExploreMapData;
  onMarkerPress?: (venueId: string) => void;
  onHotspotPress?: (hotspotId: string) => void;
};

/**
 * Web fallback: we intentionally do NOT import `react-native-maps` here.
 * This avoids bundling native-only codegen modules on web.
 */
export function ExploreMapView({ initialRegion }: ExploreMapViewProps) {
  const { setViewportRegion } = useMapViewport();
  const { t: tDiscover } = useTranslation("discover");

  useEffect(() => {
    setViewportRegion(initialRegion);
  }, [initialRegion, setViewportRegion]);

  return (
    <View style={styles.webFallback} accessibilityRole="text">
      <Text style={styles.webFallbackText}>{tDiscover("mapWebFallback")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  webFallbackText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});

