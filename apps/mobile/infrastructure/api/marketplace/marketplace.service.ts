import { getApiClient } from "@/infrastructure/api/api-client";
import type {
  IMarketplaceService,
  ListMarketplaceVenuesParams,
} from "@/infrastructure/api/marketplace/marketplace.service.interface";
import type { PaginatedResponse } from "@/infrastructure/api/types/pagination.types";
import type { MarketplaceVenueCardDto } from "@/infrastructure/api/types/venue.types";
import { toQueryString } from "@/infrastructure/api/utils/query-string";

export class MarketplaceService implements IMarketplaceService {
  private readonly client = getApiClient();

  listVenues(
    params?: ListMarketplaceVenuesParams,
  ): Promise<PaginatedResponse<MarketplaceVenueCardDto>> {
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
    return this.client.get<PaginatedResponse<MarketplaceVenueCardDto>>(
      `/marketplace/venues${q}`,
    );
  }
}
