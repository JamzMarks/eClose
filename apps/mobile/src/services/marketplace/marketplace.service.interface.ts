import type { MarketplaceArtistListItem, MarketplaceVenueListItem } from "@/types/entities/discover.types";
import type { PaginatedResponse } from "@/types/common/pagination.types";

export type ListMarketplaceVenuesParams = {
  city?: string;
  region?: string;
  taxonomyTermIds?: string;
  openToInquiriesOnly?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "name" | "city";
  order?: "ASC" | "DESC";
};

export type ListMarketplaceArtistsParams = {
  q?: string;
  taxonomyTermIds?: string;
  acceptingBookingsOnly?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "name" | "slug";
  order?: "ASC" | "DESC";
};

export interface IMarketplaceService {
  listVenues(
    params?: ListMarketplaceVenuesParams,
  ): Promise<PaginatedResponse<MarketplaceVenueListItem>>;
  listArtists(
    params?: ListMarketplaceArtistsParams,
  ): Promise<PaginatedResponse<MarketplaceArtistListItem>>;
}
