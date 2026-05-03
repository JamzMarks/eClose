import type { ExploreVenuePin } from "@/types/entities/explore.types";
import { normalizeVenueMarkerKind } from "@/lib/maps/marker-registry.defaults";
import type { ExploreMapVenueListItemDto } from "@/contracts/explore-map-venues.types";

function subtitleFromVenue(item: ExploreMapVenueListItemDto): string {
  const a = item.venue.address;
  const neighborhood = a.neighborhood?.trim();
  const city = a.city?.trim() ?? "";
  if (neighborhood && city) return `${neighborhood} · ${city}`;
  return city || a.region || "—";
}

/**
 * Converte um item da API de mapa no pin usado pelo Explorar.
 */
export function exploreMapVenueItemToPin(item: ExploreMapVenueListItemDto): ExploreVenuePin | null {
  const { venue } = item;
  const lat = venue.geoLat;
  const lng = venue.geoLng;
  if (lat == null || lng == null) return null;

  const kind = normalizeVenueMarkerKind(item.explorePinKind);

  return {
    id: venue.id,
    title: venue.name,
    subtitle: subtitleFromVenue(item),
    latitude: lat,
    longitude: lng,
    kind,
    primaryMediaUrl: item.primaryMediaUrl,
  };
}

export function exploreMapVenuesResponseToPins(items: ExploreMapVenueListItemDto[]): ExploreVenuePin[] {
  return items.map(exploreMapVenueItemToPin).filter((p): p is ExploreVenuePin => p != null);
}
