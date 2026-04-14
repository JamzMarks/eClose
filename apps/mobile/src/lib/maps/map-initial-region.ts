import { useMemo } from "react";

import { useAppLocation } from "@/contexts/location-context";
import type { MapRegion } from "@/lib/maps/types";

/** Vista por defeito (Lisboa e arredores) quando não há GPS. */
export const DEFAULT_EXPLORE_REGION_PT: MapRegion = {
  latitude: 38.7223,
  longitude: -9.1393,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

/**
 * Região sugerida para o tab Mapa: última posição conhecida com zoom de bairro,
 * ou fallback regional estável.
 */
export function useSuggestedExploreRegion(): MapRegion {
  const { coords, hydrated } = useAppLocation();

  return useMemo(() => {
    if (hydrated && coords) {
      return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
    }
    return DEFAULT_EXPLORE_REGION_PT;
  }, [hydrated, coords?.latitude, coords?.longitude]);
}
