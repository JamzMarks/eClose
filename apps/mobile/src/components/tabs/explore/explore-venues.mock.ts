import { exploreMapVenuesResponseToPins } from "@/services/explore/explore-map-venues.mapper";
import { MOCK_EXPLORE_MAP_VENUES_RESPONSE } from "@/services/explore/mock/explore-map-venues.response.mock";

/**
 * Pins derivados da resposta mock da API (`MOCK_EXPLORE_MAP_VENUES_RESPONSE`).
 */
export const EXPLORE_VENUE_MOCK_PINS = exploreMapVenuesResponseToPins(
  MOCK_EXPLORE_MAP_VENUES_RESPONSE.items,
);

export { MOCK_EXPLORE_MAP_VENUES_RESPONSE } from "@/services/explore/mock/explore-map-venues.response.mock";
