/**
 * Paginação em memória sobre `discover.seed-data` — apenas para consumo interno dos serviços.
 */
import type { DiscoverEventListFilters, DiscoverVenueListFilters } from "@/services/discover/discover-list-filters.types";
import type { MarketplaceVenueListItem, PublishedEventListItem } from "@/services/discover/discover-list.types";
import { MOCK_EXPLORE_VENUES, MOCK_HOME_EVENTS } from "@/services/discover/discover.seed-data";
import type { ListMarketplaceVenuesParams } from "@/services/marketplace/marketplace.service.interface";
import type { ListPublishedEventsParams } from "@/services/types/event.types";
import type { PaginatedResponse } from "@/services/types/pagination.types";

function slicePage<T>(all: T[], page: number, limit: number): PaginatedResponse<T> {
  const start = (page - 1) * limit;
  const items = all.slice(start, start + limit);
  return { items, total: all.length, page, limit };
}

function stubDelay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 320));
}

function matchesCity(text: string | null | undefined, cityFilter: string): boolean {
  if (!cityFilter.trim()) return true;
  const t = (text ?? "").toLowerCase();
  return t.includes(cityFilter.trim().toLowerCase());
}

function applyVenueFilters(all: MarketplaceVenueListItem[], f: DiscoverVenueListFilters): MarketplaceVenueListItem[] {
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

function applyEventFilters(all: PublishedEventListItem[], f: DiscoverEventListFilters): PublishedEventListItem[] {
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

function eventFiltersFromListParams(p?: ListPublishedEventsParams): DiscoverEventListFilters {
  return {
    city: (p?.city ?? "").trim(),
    query: (p?.q ?? "").trim(),
    locationMode: p?.discoveryLocationMode ?? "ALL",
  };
}

function venueFiltersFromListParams(p?: ListMarketplaceVenuesParams): DiscoverVenueListFilters {
  return {
    city: (p?.city ?? "").trim(),
    region: (p?.region ?? "").trim(),
    openToInquiriesOnly: p?.openToInquiriesOnly ?? false,
  };
}

export async function paginateLocalPublishedEvents(
  params?: ListPublishedEventsParams,
): Promise<PaginatedResponse<PublishedEventListItem>> {
  await stubDelay();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 15;
  const filtered = applyEventFilters(MOCK_HOME_EVENTS, eventFiltersFromListParams(params));
  return slicePage(filtered, page, limit);
}

export async function paginateLocalVenues(
  params?: ListMarketplaceVenuesParams,
): Promise<PaginatedResponse<MarketplaceVenueListItem>> {
  await stubDelay();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 15;
  const filtered = applyVenueFilters(MOCK_EXPLORE_VENUES, venueFiltersFromListParams(params));
  return slicePage(filtered, page, limit);
}
