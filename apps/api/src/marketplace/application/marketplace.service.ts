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
  Paginated,
} from "@/marketplace/interfaces/marketplace.service.interface";

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
    page?: number;
    limit?: number;
    sortBy?: "name" | "slug";
    order?: "ASC" | "DESC";
  }): Promise<Paginated<MarketplaceArtistCard>> {
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

    const sortBy = filters.sortBy ?? "name";
    const order = filters.order ?? "ASC";
    const mul = order === "DESC" ? -1 : 1;
    list = [...list].sort((a, b) => {
      const av = sortBy === "slug" ? a.slug : a.name.toLowerCase();
      const bv = sortBy === "slug" ? b.slug : b.name.toLowerCase();
      return av.localeCompare(bv) * mul;
    });

    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
    const total = list.length;
    const slice = list.slice((page - 1) * limit, page * limit);

    const primaryByArtistId = await this.media.getPrimaryMany(
      MediaParentType.ARTIST,
      slice.map((a) => a.id),
    );
    const items: MarketplaceArtistCard[] = slice.map((artist) => {
      const primary = primaryByArtistId.get(artist.id) ?? null;
      return {
        artist,
        primaryMediaUrl: primary?.sourceUrl ?? null,
      };
    });
    return { items, total, page, limit };
  }

  async listVenuesForArtists(filters: {
    city?: string;
    region?: string;
    taxonomyTermIds?: string[];
    openToInquiriesOnly?: boolean;
    page?: number;
    limit?: number;
    sortBy?: "name" | "city";
    order?: "ASC" | "DESC";
  }): Promise<Paginated<MarketplaceVenueCard>> {
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

    const sortBy = filters.sortBy ?? "name";
    const order = filters.order ?? "ASC";
    const mul = order === "DESC" ? -1 : 1;
    list = [...list].sort((a, b) => {
      const av =
        sortBy === "city" ? a.address.city.toLowerCase() : a.name.toLowerCase();
      const bv =
        sortBy === "city" ? b.address.city.toLowerCase() : b.name.toLowerCase();
      return av.localeCompare(bv) * mul;
    });

    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
    const total = list.length;
    const slice = list.slice((page - 1) * limit, page * limit);

    const primaryByVenueId = await this.media.getPrimaryMany(
      MediaParentType.VENUE,
      slice.map((v) => v.id),
    );
    const items: MarketplaceVenueCard[] = slice.map((venue) => {
      const primary = primaryByVenueId.get(venue.id) ?? null;
      return {
        venue,
        primaryMediaUrl: primary?.sourceUrl ?? null,
      };
    });
    return { items, total, page, limit };
  }
}
