import { Platform, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";

import { getSchemeColors } from "@/constants/palette";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ExploreMapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
};

export type ExploreMapViewProps = {
  region: Region;
  markers: ExploreMapMarker[];
  onRegionChangeComplete: (region: Region) => void;
  style?: StyleProp<ViewStyle>;
  webFallbackMessage: string;
};

/**
 * Apresentação do mapa: sem chamadas HTTP nem regras de região — fica no pai.
 */
export function ExploreMapView({
  region,
  markers,
  onRegionChangeComplete,
  style,
  webFallbackMessage,
}: ExploreMapViewProps) {
  const scheme = useColorScheme() ?? "light";
  const c = getSchemeColors(scheme);

  if (Platform.OS === "web") {
    return (
      <View style={[styles.fallback, { backgroundColor: c.surface }, style]}>
        <Text style={[styles.fallbackText, { color: c.textSecondary }]}>{webFallbackMessage}</Text>
      </View>
    );
  }

  return (
    <MapView
      style={[styles.map, style]}
      region={region}
      onRegionChangeComplete={onRegionChangeComplete}
      showsUserLocation={false}>
      {markers.map((m) => (
        <Marker
          key={m.id}
          coordinate={{ latitude: m.latitude, longitude: m.longitude }}
          title={m.title}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  fallbackText: {
    textAlign: "center",
    fontSize: 15,
  },
});
