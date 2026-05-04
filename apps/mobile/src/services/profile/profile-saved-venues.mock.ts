import { MOCK_EXPLORE_MAP_VENUES_RESPONSE } from "@/services/explore/mock/explore-map-venues.response.mock";

/** Alguns pins mock para a secção «Guardados» no perfil (UI-only). */
export function profileSavedVenuePinsMock() {
  return MOCK_EXPLORE_MAP_VENUES_RESPONSE.items.slice(0, 4).map((it) => ({
    id: it.venue.id,
    title: it.venue.name,
    subtitle: [it.venue.address.neighborhood, it.venue.address.city].filter(Boolean).join(" · "),
    latitude: it.venue.geoLat,
    longitude: it.venue.geoLng,
    kind: it.explorePinKind,
    primaryMediaUrl: it.primaryMediaUrl,
  }));
}
