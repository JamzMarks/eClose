import type { EventDto } from "@/services/types/event.types";
import type { MarketplaceVenueCardDto } from "@/services/types/venue.types";

/** Item de listagem de eventos publicados (API ou resposta local unificada). */
export type PublishedEventListItem = {
  event: EventDto;
  primaryMediaUrl: string | null;
  galleryUrls?: string[];
  categoryLabel?: string;
};

/** Item de listagem de venues no marketplace. */
export type MarketplaceVenueListItem = MarketplaceVenueCardDto & {
  categoryLabel?: string;
  galleryUrls?: string[];
};

/** @deprecated Preferir `MarketplaceVenueListItem` — alias legado na UI. */
export type ExploreVenueRow = MarketplaceVenueListItem;

/** @deprecated Preferir `PublishedEventListItem`. */
export type PublishedEventRow = PublishedEventListItem;
