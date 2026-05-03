import type { ArtistDto } from "@/contracts/artist.types";
import type { EventDto, DiscoveryLocationModeFilter } from "@/contracts/event.types";
import type { MarketplaceVenueCardDto } from "@/contracts/venue.types";

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

/** Item de listagem de artistas no marketplace (`GET /marketplace/artists`). */
export type MarketplaceArtistListItem = {
  artist: ArtistDto;
  primaryMediaUrl: string | null;
  categoryLabel?: string;
};

/** @deprecated Preferir `MarketplaceVenueListItem` — alias legado na UI. */
export type ExploreVenueRow = MarketplaceVenueListItem;

/** @deprecated Preferir `PublishedEventListItem`. */
export type PublishedEventRow = PublishedEventListItem;

/** Filtros de listagem — ordenação fixa na API (data para eventos, nome para espaços). */
export type DiscoverEventListFilters = {
  city: string;
  locationMode: DiscoveryLocationModeFilter;
  query: string;
  /** ISO 8601 (UTC); vazio = sem limite inferior. */
  from: string;
  /** ISO 8601 (UTC); vazio = sem limite superior. */
  to: string;
};

/** Filtros enviados a `useHomePublishedEvents` (inclui taxonomia das categorias rápidas). */
export type HomePublishedEventsFilters = DiscoverEventListFilters & {
  taxonomyTermIds?: string;
};

export type DiscoverVenueListFilters = {
  city: string;
  region: string;
  openToInquiriesOnly: boolean;
};

export const defaultDiscoverEventFilters = (): DiscoverEventListFilters => ({
  city: "",
  locationMode: "ALL",
  query: "",
  from: "",
  to: "",
});

export const defaultDiscoverVenueFilters = (): DiscoverVenueListFilters => ({
  city: "",
  region: "",
  openToInquiriesOnly: false,
});

