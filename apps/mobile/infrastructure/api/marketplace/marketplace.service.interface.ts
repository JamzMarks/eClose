import type { MarketplaceVenueCardDto } from "@/infrastructure/api/types/venue.types";
import type { PaginatedResponse } from "@/infrastructure/api/types/pagination.types";

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

export interface IMarketplaceService {
  listVenues(
    params?: ListMarketplaceVenuesParams,
  ): Promise<PaginatedResponse<MarketplaceVenueCardDto>>;
}
