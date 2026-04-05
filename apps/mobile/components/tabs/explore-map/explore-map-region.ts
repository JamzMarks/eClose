import type { Region } from "react-native-maps";

export const PORTUGAL_INITIAL_REGION: Region = {
  latitude: 39.4,
  longitude: -8.2,
  latitudeDelta: 5.5,
  longitudeDelta: 5.5,
};

export function coordinateInsideRegion(
  latitude: number,
  longitude: number,
  region: Region,
): boolean {
  const dLat = region.latitudeDelta / 2;
  const dLng = region.longitudeDelta / 2;
  return (
    latitude >= region.latitude - dLat &&
    latitude <= region.latitude + dLat &&
    longitude >= region.longitude - dLng &&
    longitude <= region.longitude + dLng
  );
}
