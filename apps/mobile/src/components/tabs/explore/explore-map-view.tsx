import { useEffect, useCallback } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import type { ExploreMapData } from "@/types/entities/explore.types";
import { GOOGLE_MAP_MINIMAL_STYLE } from "@/lib/maps/google-map-minimal-style";
import { useMapViewport } from "@/lib/maps/map-provider";
import { useVenueMarkerRegistry } from "@/lib/maps/map-marker-provider";
import type { MapRegion } from "@/lib/maps/types";

export type ExploreMapViewProps = {
  initialRegion: MapRegion;
  data: ExploreMapData;
  onMarkerPress?: (venueId: string) => void;
  onHotspotPress?: (hotspotId: string) => void;
};

/**
 * Mapa nativo com pins por tipo de venue. No web, fallback + sincroniza viewport para a lista.
 */
export function ExploreMapView({ initialRegion, data, onMarkerPress, onHotspotPress }: ExploreMapViewProps) {
  const { setViewportRegion } = useMapViewport();
  const { resolve } = useVenueMarkerRegistry();
  const { t: tDiscover } = useTranslation("discover");
  const { t: tExplore } = useTranslation("explore");

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
        <Text style={styles.webFallbackText}>{tDiscover("mapWebFallback")}</Text>
      </View>
    );
  }

  const MapView = require("react-native-maps").default as typeof import("react-native-maps").default;
  const { Circle, Marker } = require("react-native-maps") as typeof import("react-native-maps");

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
      showsPointsOfInterest={false}
      customMapStyle={Platform.OS === "android" ? GOOGLE_MAP_MINIMAL_STYLE : undefined}
    >
      {data.hotspots.map((h) => (
        <Circle
          key={h.id}
          center={{ latitude: h.latitude, longitude: h.longitude }}
          radius={h.radiusMeters}
          strokeColor="rgba(0, 122, 255, 0.55)"
          fillColor="rgba(0, 122, 255, 0.12)"
          strokeWidth={2}
          onTouchEndCapture={() => onHotspotPress?.(h.id)}
          
          // onPress={() => onHotspotPress?.(h.id)}
        />
      ))}
      {data.pins.map((m) => {
        const pinColor = resolve(m.kind).pinColor;
        const kindName = tExplore(`markers.${m.kind}`);
        return (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            pinColor={pinColor}
            tracksViewChanges={false}
            identifier={m.id}
            onPress={() => onMarkerPress?.(m.id)}
            accessibilityLabel={`${m.title}, ${kindName}`}
          />
        );
      })}
    </MapView>
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
