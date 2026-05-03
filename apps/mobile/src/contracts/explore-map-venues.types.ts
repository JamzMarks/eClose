import type { MarketplaceVenueCardDto } from "@/contracts/venue.types";
import type { VenueMarkerKind } from "@/lib/maps/marker-registry.types";

/**
 * Extensão opcional do cartão de marketplace para o mapa (API futura).
 * Ex.: `GET /marketplace/venues?bbox=…` pode incluir `explorePinKind` ou só taxonomias.
 */
export type ExploreMapVenueListItemDto = MarketplaceVenueCardDto & {
  explorePinKind?: VenueMarkerKind;
};

/**
 * Forma típica de lista paginada por bbox (cursor).
 * Alinhar com OpenAPI quando existir.
 */
export type ExploreMapVenuesResponseDto = {
  items: ExploreMapVenueListItemDto[];
  nextCursor: string | null;
};

