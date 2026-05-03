import { USE_LOCAL_SERVICE_DATA } from "@/services/config/service-data-source";
import type { MarketplaceArtistListItem, MarketplaceVenueListItem } from "@/types/entities/discover.types";
import { paginateLocalArtists, paginateLocalVenues } from "@/services/discover/discover.stub-pagination";
import { getApiClient } from "@/services/api-client";
import type {
  IMarketplaceService,
  ListMarketplaceArtistsParams,
  ListMarketplaceVenuesParams,
} from "@/services/marketplace/marketplace.service.interface";
import type { PaginatedResponse } from "@/types/common/pagination.types";
import type { ArtistDto } from "@/contracts/artist.types";
import type { MarketplaceVenueCardDto } from "@/contracts/venue.types";
import { toQueryString } from "@/services/utils/query-string";

export class MarketplaceService implements IMarketplaceService {
  private readonly client = getApiClient();

  listVenues(
    params?: ListMarketplaceVenuesParams,
  ): Promise<PaginatedResponse<MarketplaceVenueListItem>> {
    if (USE_LOCAL_SERVICE_DATA) {
      return paginateLocalVenues(params);
    }

    const q = toQueryString({
      city: params?.city,
      region: params?.region,
      taxonomyTermIds: params?.taxonomyTermIds,
      openToInquiriesOnly: params?.openToInquiriesOnly,
      page: params?.page,
      limit: params?.limit,
      sortBy: params?.sortBy,
      order: params?.order,
    });

    return this.client
      .get<PaginatedResponse<MarketplaceVenueCardDto>>(`/marketplace/venues${q}`)
      .then((res) => ({
        ...res,
        items: res.items.map((row) => ({ ...row }) satisfies MarketplaceVenueListItem),
      }));
  }

  listArtists(
    params?: ListMarketplaceArtistsParams,
  ): Promise<PaginatedResponse<MarketplaceArtistListItem>> {
    if (USE_LOCAL_SERVICE_DATA) {
      return paginateLocalArtists(params);
    }

    const q = toQueryString({
      q: params?.q,
      taxonomyTermIds: params?.taxonomyTermIds,
      acceptingBookingsOnly: params?.acceptingBookingsOnly,
      page: params?.page,
      limit: params?.limit,
      sortBy: params?.sortBy,
      order: params?.order,
    });

    return this.client
      .get<PaginatedResponse<{ artist: ArtistDto; primaryMediaUrl: string | null }>>(
        `/marketplace/artists${q}`,
      )
      .then((res) => ({
        ...res,
        items: res.items.map((row) => ({
          artist: row.artist,
          primaryMediaUrl: row.primaryMediaUrl ?? null,
        })),
      }));
  }
}
