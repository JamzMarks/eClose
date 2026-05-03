import type { ExploreVenuePin } from "@/types/entities/explore.types";
import type { VenueMarkerKind } from "@/lib/maps/marker-registry.types";

/** Ordem estável dos chips no modal (inclui `default` para pins genéricos). */
export const EXPLORE_FILTER_KIND_ORDER: VenueMarkerKind[] = [
  "bar",
  "restaurant",
  "cafe",
  "club",
  "theater",
  "studio",
  "festival",
  "train",
  "bus",
  "default",
];

export type ExploreMapFilters = {
  /**
   * Tipos de venue a mostrar.
   * Array vazio = sem restrição (todos os tipos na região).
   */
  venueKinds: VenueMarkerKind[];
};

/**
 * Conjunto inicial (app default): mostrar todos os tipos.
 * `venueKinds: []` = sem restrição (todos os tipos na região).
 */
export const DEFAULT_EXPLORE_MAP_FILTERS: ExploreMapFilters = {
  venueKinds: [],
};

/** Mostrar todos os tipos de pin na região visível. */
export const EXPLORE_MAP_FILTERS_SHOW_ALL: ExploreMapFilters = {
  venueKinds: [],
};

export function exploreMapFiltersEqual(a: ExploreMapFilters, b: ExploreMapFilters): boolean {
  if (a.venueKinds.length !== b.venueKinds.length) {
    return false;
  }
  const setB = new Set(b.venueKinds);
  return a.venueKinds.every((k) => setB.has(k));
}

export function isExploreMapFiltersAppDefault(f: ExploreMapFilters): boolean {
  return exploreMapFiltersEqual(f, DEFAULT_EXPLORE_MAP_FILTERS);
}

export function applyExploreMapFilters(
  venues: ExploreVenuePin[],
  filters: ExploreMapFilters,
): ExploreVenuePin[] {
  if (filters.venueKinds.length === 0) {
    return venues;
  }
  const allow = new Set(filters.venueKinds);
  return venues.filter((v) => allow.has(v.kind));
}

/** Filtra por texto livre em título/subtítulo (ex.: cidade ou nome), case-insensitive. */
export function applyExploreCityQuery(
  venues: ExploreVenuePin[],
  cityQuery: string,
): ExploreVenuePin[] {
  const q = cityQuery.trim().toLowerCase();
  if (!q) {
    return venues;
  }
  return venues.filter((v) => {
    const title = v.title.toLowerCase();
    const sub = v.subtitle.toLowerCase();
    return title.includes(q) || sub.includes(q);
  });
}
