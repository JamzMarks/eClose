import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { regionToBoundingBox } from "@/lib/maps/map-geometry";
import type { BoundingBox, MapRegion } from "@/lib/maps/types";

export type MapViewportContextValue = {
  /** Última região conhecida (ex.: centro do mapa + deltas). */
  viewportRegion: MapRegion | null;
  /** Derivado de `viewportRegion`; útil para pedidos à API por bbox. */
  viewportBounds: BoundingBox | null;
  /** Atualiza o viewport (fim de pan/zoom, arranque, ou `null` para limpar). */
  setViewportRegion: (region: MapRegion | null) => void;
};

const MapViewportContext = createContext<MapViewportContextValue | null>(null);

export type MapViewportProviderProps = {
  children: ReactNode;
  /** Região inicial opcional (ex.: derivada de GPS ou default regional). */
  initialRegion?: MapRegion | null;
};

/**
 * Estado do mapa de descoberta: viewport actual e bounds para queries geo à API.
 * O motor visual (react-native-maps, MapLibre, …) chama `setViewportRegion`.
 */
export function MapViewportProvider({ children, initialRegion = null }: MapViewportProviderProps) {
  const [viewportRegion, setViewportRegionState] = useState<MapRegion | null>(initialRegion);

  const setViewportRegion = useCallback((region: MapRegion | null) => {
    setViewportRegionState(region);
  }, []);

  const viewportBounds = useMemo(
    () => (viewportRegion ? regionToBoundingBox(viewportRegion) : null),
    [viewportRegion],
  );

  const value = useMemo<MapViewportContextValue>(
    () => ({
      viewportRegion,
      viewportBounds,
      setViewportRegion,
    }),
    [viewportRegion, viewportBounds, setViewportRegion],
  );

  return <MapViewportContext.Provider value={value}>{children}</MapViewportContext.Provider>;
}

export function useMapViewport(): MapViewportContextValue {
  const ctx = useContext(MapViewportContext);
  if (!ctx) {
    throw new Error("useMapViewport must be used within MapViewportProvider");
  }
  return ctx;
}
