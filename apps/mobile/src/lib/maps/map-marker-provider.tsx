import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEFAULT_VENUE_MARKER_REGISTRY } from "@/lib/maps/marker-registry.defaults";
import type {
  VenueMarkerKind,
  VenueMarkerRegistry,
  VenueMarkerVisualConfig,
} from "@/lib/maps/marker-registry.types";

export type MapMarkerContextValue = {
  /** Registo actual (imutável por updates via merge). */
  registry: VenueMarkerRegistry;
  /** Resolve estilo para um tipo de venue. */
  resolve: (kind: VenueMarkerKind) => VenueMarkerVisualConfig;
  /**
   * Funde overrides no registo (ex.: tema, white-label).
   * Passa `{ bar: { pinColor: '#fff' } }` para substituir só o que mudar.
   */
  mergeRegistry: (patch: Partial<Record<VenueMarkerKind, Partial<VenueMarkerVisualConfig>>>) => void;
};

const MapMarkerContext = createContext<MapMarkerContextValue | null>(null);

function deepMergeRegistry(
  base: VenueMarkerRegistry,
  patch: Partial<Record<VenueMarkerKind, Partial<VenueMarkerVisualConfig>>>,
): VenueMarkerRegistry {
  const next = { ...base };
  (Object.keys(patch) as VenueMarkerKind[]).forEach((key) => {
    const p = patch[key];
    if (!p) return;
    next[key] = { ...base[key], ...p };
  });
  return next;
}

export type MapMarkerProviderProps = {
  children: ReactNode;
  /** Registo inicial opcional (substitui o objecto por defeito por completo). */
  initialRegistry?: VenueMarkerRegistry;
};

/**
 * Provider de estilos de marcadores por tipo de venue — escalável via `mergeRegistry` ou `initialRegistry`.
 */
export function MapMarkerProvider({ children, initialRegistry }: MapMarkerProviderProps) {
  const [registry, setRegistry] = useState<VenueMarkerRegistry>(
    () => initialRegistry ?? DEFAULT_VENUE_MARKER_REGISTRY,
  );

  const resolve = useCallback(
    (kind: VenueMarkerKind): VenueMarkerVisualConfig => registry[kind] ?? registry.default,
    [registry],
  );

  const mergeRegistry = useCallback(
    (patch: Partial<Record<VenueMarkerKind, Partial<VenueMarkerVisualConfig>>>) => {
      setRegistry((prev) => deepMergeRegistry(prev, patch));
    },
    [],
  );

  const value = useMemo<MapMarkerContextValue>(
    () => ({
      registry,
      resolve,
      mergeRegistry,
    }),
    [registry, resolve, mergeRegistry],
  );

  return <MapMarkerContext.Provider value={value}>{children}</MapMarkerContext.Provider>;
}

export function useVenueMarkerRegistry(): MapMarkerContextValue {
  const ctx = useContext(MapMarkerContext);
  if (!ctx) {
    throw new Error("useVenueMarkerRegistry must be used within MapMarkerProvider");
  }
  return ctx;
}
