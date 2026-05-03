import type { VenueMarkerKind, VenueMarkerRegistry } from "@/lib/maps/marker-registry.types";

/**
 * Registo por defeito — objecto único fácil de substituir ou fundir no provider.
 * Cores distintas por tipo (Material-ish) para leitura rápida no mapa.
 */
export const DEFAULT_VENUE_MARKER_REGISTRY: VenueMarkerRegistry = {
  bar: { pinColor: "#7C3AED", labelKey: "bar" },
  restaurant: { pinColor: "#EA580C", labelKey: "restaurant" },
  cafe: { pinColor: "#CA8A04", labelKey: "cafe" },
  club: { pinColor: "#DB2777", labelKey: "club" },
  theater: { pinColor: "#2563EB", labelKey: "theater" },
  studio: { pinColor: "#0D9488", labelKey: "studio" },
  festival: { pinColor: "#DC2626", labelKey: "festival" },
  train: { pinColor: "#0369A1", labelKey: "train" },
  bus: { pinColor: "#15803D", labelKey: "bus" },
  default: { pinColor: "#475569", labelKey: "default" },
};

export function normalizeVenueMarkerKind(value: string | undefined | null): VenueMarkerKind {
  if (!value) return "default";
  if (value in DEFAULT_VENUE_MARKER_REGISTRY) return value as VenueMarkerKind;
  return "default";
}
