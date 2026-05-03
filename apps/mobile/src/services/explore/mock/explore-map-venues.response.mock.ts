import type { ExploreMapVenueListItemDto } from "@/contracts/explore-map-venues.types";
import type { VenueMarkerKind } from "@/lib/maps/marker-registry.types";

const ISO = "2026-01-15T12:00:00.000Z";

function item(
  id: string,
  name: string,
  slug: string,
  lat: number,
  lng: number,
  addr: { line1: string; city: string; region: string; neighborhood?: string },
  kind: VenueMarkerKind,
): ExploreMapVenueListItemDto {
  return {
    explorePinKind: kind,
    primaryMediaUrl: null,
    venue: {
      id,
      name,
      slug,
      description: `Espaço de demonstração: ${name}`,
      ownerUserId: null,
      address: {
        line1: addr.line1,
        city: addr.city,
        region: addr.region,
        countryCode: "BR",
        neighborhood: addr.neighborhood ?? null,
      },
      geoLat: lat,
      geoLng: lng,
      timezone: "America/Sao_Paulo",
      openingHours: [],
      taxonomyTermIds: [],
      marketplaceListed: true,
      openToArtistInquiries: true,
      primaryMediaAssetId: null,
      isActive: true,
      createdAt: ISO,
      updatedAt: ISO,
    },
  };
}

/**
 * Resposta mock alinhada a `ExploreMapVenuesResponseDto` (ex.: `GET /marketplace/venues?minLat=…`).
 * Coordenadas concentradas em Barueri (SP) para validar mapa + hotspots.
 */
const ITEMS: ExploreMapVenueListItemDto[] = [
  item(
    "mock-venue-barueri-01",
    "Bar do Centro (demo)",
    "bar-centro-barueri-demo",
    -23.5112,
    -46.8766,
    { line1: "Av. 26 de Março", city: "Barueri", region: "SP", neighborhood: "Centro" },
    "bar",
  ),
  item(
    "mock-venue-barueri-02",
    "Restaurante na Alameda (demo)",
    "restaurante-alameda-barueri-demo",
    -23.5041,
    -46.8498,
    { line1: "Alameda Rio Negro", city: "Barueri", region: "SP", neighborhood: "Alphaville" },
    "restaurant",
  ),
  item(
    "mock-venue-barueri-03",
    "Café do Escritório (demo)",
    "cafe-escritorio-demo",
    -23.5002,
    -46.8469,
    { line1: "Av. Marcos Penteado de Ulhôa Rodrigues", city: "Barueri", region: "SP", neighborhood: "Alphaville" },
    "cafe",
  ),
  item(
    "mock-venue-barueri-04",
    "Casa de Show (demo)",
    "casa-show-barueri-demo",
    -23.5078,
    -46.8624,
    { line1: "Av. Copacabana", city: "Barueri", region: "SP", neighborhood: "Alphaville" },
    "theater",
  ),
  item(
    "mock-venue-barueri-05",
    "Clube Noturno (demo)",
    "clube-noturno-barueri-demo",
    -23.5032,
    -46.8536,
    { line1: "Av. Sagitário", city: "Barueri", region: "SP", neighborhood: "Alphaville" },
    "club",
  ),
  item(
    "mock-transit-barueri-train-01",
    "Estação Barueri (demo)",
    "estacao-barueri-demo",
    -23.5106,
    -46.8752,
    { line1: "Av. Anápolis", city: "Barueri", region: "SP", neighborhood: "Centro" },
    "train",
  ),
];

export const MOCK_EXPLORE_MAP_VENUES_RESPONSE = {
  items: ITEMS,
  nextCursor: null as string | null,
};
