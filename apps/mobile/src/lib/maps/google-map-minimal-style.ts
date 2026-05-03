import type { MapStyleElement } from "react-native-maps";

/**
 * Estilo Google Maps: menos ruído visual (POIs e ícones de trânsito do provider).
 * Só aplicado no Android (MapView com Google); no iOS com MapKit usa-se `showsPointsOfInterest`.
 */
export const GOOGLE_MAP_MINIMAL_STYLE: MapStyleElement[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];
