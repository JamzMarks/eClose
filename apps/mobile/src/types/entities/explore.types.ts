import type { VenueMarkerKind } from "@/lib/maps/marker-registry.types";

/** Item de espaço mostrado no mapa + lista do Explorar (substituível por resposta da API). */
export type ExploreVenuePin = {
  id: string;
  title: string;
  subtitle: string;
  latitude: number;
  longitude: number;
  kind: VenueMarkerKind;
  primaryMediaUrl: string | null;
};

export type ExploreHotspot = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  /** Raio em metros (render via Circle). */
  radiusMeters: number;
};

export type ExploreMapData = {
  pins: ExploreVenuePin[];
  hotspots: ExploreHotspot[];
};

