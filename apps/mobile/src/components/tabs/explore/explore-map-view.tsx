import { useEffect, useCallback } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useMapViewport } from "@/lib/maps/map-provider";
import type { MapRegion } from "@/lib/maps/types";

export type ExploreMapViewProps = {
  initialRegion: MapRegion;
};

/**
 * Mapa nativo (iOS/Android). No web mostra fallback — `react-native-maps` não suporta web neste projeto.
 * Actualiza `MapViewportProvider` em `onRegionChangeComplete` para queries geo à API.
 */
export function ExploreMapView({ initialRegion }: ExploreMapViewProps) {
  const { setViewportRegion } = useMapViewport();
  const { t } = useTranslation("discover");

  useEffect(() => {
    setViewportRegion(initialRegion);
  }, [initialRegion, setViewportRegion]);

  const onRegionChangeComplete = useCallback(
    (region: MapRegion) => {
      setViewportRegion(region);
    },
    [setViewportRegion],
  );

  if (Platform.OS === "web") {
    return (
      <View style={styles.webFallback} accessibilityRole="text">
        <Text style={styles.webFallbackText}>{t("mapWebFallback")}</Text>
      </View>
    );
  }

  // Evita carregar o módulo nativo no bundle web.
  const MapView = require("react-native-maps").default as typeof import("react-native-maps").default;

  return (
    <MapView
      style={styles.map}
      initialRegion={initialRegion}
      onRegionChangeComplete={onRegionChangeComplete}
      rotateEnabled
      pitchEnabled={false}
      showsCompass={false}
      showsUserLocation
      showsMyLocationButton={false}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
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
