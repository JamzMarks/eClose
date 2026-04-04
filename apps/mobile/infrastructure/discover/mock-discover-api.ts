import type { PaginatedResponse } from "@/infrastructure/api/types/pagination.types";

import { MOCK_EXPLORE_VENUES, MOCK_HOME_EVENTS } from "./mock-discover-data";
import type { ExploreVenueRow } from "./mock-discover-data";

function slicePage<T>(all: T[], page: number, limit: number): PaginatedResponse<T> {
  const start = (page - 1) * limit;
  const items = all.slice(start, start + limit);
  return { items, total: all.length, page, limit };
}

function mockDelay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 320));
}

export async function mockPaginatedVenues(
  page: number,
  limit: number,
): Promise<PaginatedResponse<ExploreVenueRow>> {
  await mockDelay();
  return slicePage(MOCK_EXPLORE_VENUES, page, limit);
}

export async function mockPaginatedEvents(
  page: number,
  limit: number,
): Promise<PaginatedResponse<PublishedEventRow>> {
  await mockDelay();
  return slicePage(MOCK_HOME_EVENTS, page, limit);
}
