import { Artist } from "@/artist/entity/artist.entity";
import { Venue } from "@/venue/entity/venue.entity";

export type MarketplaceArtistCard = {
  artist: Artist;
  primaryMediaUrl: string | null;
};

export type MarketplaceVenueCard = {
  venue: Venue;
  primaryMediaUrl: string | null;
};

/**
 * Descoberta artista ↔ venue. Não acopla calendário nem chat: agendamento usa {@link ICalendarService}
 * em fluxos próprios; “chamar” fica a cargo do cliente (ex. abrir conversa com ids do chat).
 */
export interface IMarketplaceService {
  listArtistsForVenues(filters: {
    q?: string;
    taxonomyTermIds?: string[];
    acceptingBookingsOnly?: boolean;
  }): Promise<MarketplaceArtistCard[]>;

  listVenuesForArtists(filters: {
    city?: string;
    region?: string;
    taxonomyTermIds?: string[];
    openToInquiriesOnly?: boolean;
  }): Promise<MarketplaceVenueCard[]>;
}
