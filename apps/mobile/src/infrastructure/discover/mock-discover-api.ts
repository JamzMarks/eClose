import type { PaginatedResponse } from "@/services/types/pagination.types";

import type { DiscoverEventListFilters, DiscoverVenueListFilters } from "@/infrastructure/discover/discover-list-filters.types";

import {
  MOCK_EXPLORE_VENUES,
  MOCK_HOME_EVENTS,
  type ExploreVenueRow,
  type PublishedEventRow,
} from "./mock-discover-data";

function slicePage<T>(all: T[], page: number, limit: number): PaginatedResponse<T> {
  const start = (page - 1) * limit;
  const items = all.slice(start, start + limit);
  return { items, total: all.length, page, limit };
}

function mockDelay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 320));
}

function matchesCity(text: string | null | undefined, cityFilter: string): boolean {
  if (!cityFilter.trim()) return true;
  const t = (text ?? "").toLowerCase();
  return t.includes(cityFilter.trim().toLowerCase());
}

function applyVenueFilters(all: ExploreVenueRow[], f: DiscoverVenueListFilters): ExploreVenueRow[] {
  let rows = [...all];
  if (f.city.trim()) {
    const c = f.city.trim().toLowerCase();
    rows = rows.filter((r) => r.venue.address.city.toLowerCase().includes(c));
  }
  if (f.region.trim()) {
    const reg = f.region.trim().toLowerCase();
    rows = rows.filter((r) => r.venue.address.region.toLowerCase().includes(reg));
  }
  if (f.openToInquiriesOnly) {
    rows = rows.filter((r) => r.venue.openToArtistInquiries);
  }
  rows.sort((a, b) => a.venue.name.localeCompare(b.venue.name, "pt"));
  return rows;
}

function applyEventFilters(all: PublishedEventRow[], f: DiscoverEventListFilters): PublishedEventRow[] {
  let rows = [...all];
  if (f.city.trim()) {
    const c = f.city.trim().toLowerCase();
    rows = rows.filter(
      (r) =>
        matchesCity(r.event.locationLabel, c) ||
        (typeof r.event.adhocAddress === "object" &&
          r.event.adhocAddress &&
          "city" in r.event.adhocAddress &&
          String((r.event.adhocAddress as { city?: string }).city ?? "")
            .toLowerCase()
            .includes(c)),
    );
  }
  if (f.locationMode === "PHYSICAL") {
    rows = rows.filter((r) => r.event.locationMode === "PHYSICAL");
  } else if (f.locationMode === "ONLINE") {
    rows = rows.filter((r) => r.event.locationMode === "ONLINE");
  }
  if (f.query.trim()) {
    const q = f.query.trim().toLowerCase();
    rows = rows.filter((r) => r.event.title.toLowerCase().includes(q));
  }
  rows.sort(
    (a, b) => new Date(a.event.startsAt).getTime() - new Date(b.event.startsAt).getTime(),
  );
  return rows;
}

export async function mockPaginatedVenues(
  page: number,
  limit: number,
  filters: DiscoverVenueListFilters,
): Promise<PaginatedResponse<ExploreVenueRow>> {
  await mockDelay();
  const filtered = applyVenueFilters(MOCK_EXPLORE_VENUES, filters);
  return slicePage(filtered, page, limit);
}

export async function mockPaginatedEvents(
  page: number,
  limit: number,
  filters: DiscoverEventListFilters,
): Promise<PaginatedResponse<PublishedEventRow>> {
  await mockDelay();
  const filtered = applyEventFilters(MOCK_HOME_EVENTS, filters);
  return slicePage(filtered, page, limit);
}
