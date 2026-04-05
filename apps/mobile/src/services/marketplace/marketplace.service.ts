import { USE_MOCK_DISCOVER } from "@/services/config/discover-mode";
import type { MarketplaceVenueListItem } from "@/services/discover/discover-list.types";
import { paginateLocalVenues } from "@/services/discover/discover.stub-pagination";
import { getApiClient } from "@/services/api-client";
import type {
  IMarketplaceService,
  ListMarketplaceVenuesParams,
} from "@/services/marketplace/marketplace.service.interface";
import type { PaginatedResponse } from "@/services/types/pagination.types";
import type { MarketplaceVenueCardDto } from "@/services/types/venue.types";
import { toQueryString } from "@/services/utils/query-string";

export class MarketplaceService implements IMarketplaceService {
  private readonly client = getApiClient();

  listVenues(
    params?: ListMarketplaceVenuesParams,
  ): Promise<PaginatedResponse<MarketplaceVenueListItem>> {
    if (USE_MOCK_DISCOVER) {
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
}
