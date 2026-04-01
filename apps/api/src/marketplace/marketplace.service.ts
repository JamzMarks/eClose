import { Inject, Injectable } from "@nestjs/common";
import { IArtistRepository } from "@/artist/interfaces/artist.repository.interface";
import { ARTIST_REPOSITORY } from "@/artist/tokens/artist.tokens";
import { IVenueRepository } from "@/venue/interfaces/venue.repository.interface";
import { VENUE_REPOSITORY } from "@/venue/tokens/venue.tokens";
import { IMediaService } from "@/media/interfaces/media.service.interface";
import { MEDIA_SERVICE } from "@/media/tokens/media.tokens";
import { MediaParentType } from "@/media/types/media-parent-type.type";
import {
  IMarketplaceService,
  MarketplaceArtistCard,
  MarketplaceVenueCard,
} from "./interfaces/marketplace.service.interface";

@Injectable()
export class MarketplaceService implements IMarketplaceService {
  constructor(
    @Inject(ARTIST_REPOSITORY) private readonly artists: IArtistRepository,
    @Inject(VENUE_REPOSITORY) private readonly venues: IVenueRepository,
    @Inject(MEDIA_SERVICE) private readonly media: IMediaService,
  ) {}

  async listArtistsForVenues(filters: {
    q?: string;
    taxonomyTermIds?: string[];
    acceptingBookingsOnly?: boolean;
  }): Promise<MarketplaceArtistCard[]> {
    const q = filters.q?.trim().toLowerCase();
    const termSet = filters.taxonomyTermIds?.length
      ? new Set(filters.taxonomyTermIds)
      : null;

    let list = (await this.artists.listAll()).filter(
      (a) => a.isActive && a.marketplaceVisible,
    );

    if (filters.acceptingBookingsOnly) {
      list = list.filter((a) => a.openToVenueBookings);
    }

    if (q) {
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.slug.includes(q) ||
          (a.headline?.toLowerCase().includes(q) ?? false) ||
          (a.bio?.toLowerCase().includes(q) ?? false),
      );
    }

    if (termSet) {
      list = list.filter((a) =>
        a.taxonomyTermIds.some((id) => termSet!.has(id)),
      );
    }

    const out: MarketplaceArtistCard[] = [];
    for (const artist of list) {
      const primary = await this.media.getPrimary(MediaParentType.ARTIST, artist.id);
      out.push({
        artist,
        primaryMediaUrl: primary?.sourceUrl ?? null,
      });
    }
    return out;
  }

  async listVenuesForArtists(filters: {
    city?: string;
    region?: string;
    taxonomyTermIds?: string[];
    openToInquiriesOnly?: boolean;
  }): Promise<MarketplaceVenueCard[]> {
    const city = filters.city?.trim().toLowerCase();
    const region = filters.region?.trim().toLowerCase();
    const termSet = filters.taxonomyTermIds?.length
      ? new Set(filters.taxonomyTermIds)
      : null;

    let list = (await this.venues.listActive()).filter((v) => v.marketplaceListed);

    if (filters.openToInquiriesOnly) {
      list = list.filter((v) => v.openToArtistInquiries);
    }

    if (city) {
      list = list.filter((v) => v.address.city.toLowerCase().includes(city));
    }
    if (region) {
      list = list.filter((v) => v.address.region.toLowerCase().includes(region));
    }
    if (termSet) {
      list = list.filter((v) =>
        v.taxonomyTermIds.some((id) => termSet!.has(id)),
      );
    }

    const out: MarketplaceVenueCard[] = [];
    for (const venue of list) {
      const primary = await this.media.getPrimary(MediaParentType.VENUE, venue.id);
      out.push({
        venue,
        primaryMediaUrl: primary?.sourceUrl ?? null,
      });
    }
    return out;
  }
}
