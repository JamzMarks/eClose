/**
 * Paginação em memória sobre dados locais dos services — apenas consumo interno.
 */
import type {
  DiscoverEventListFilters,
  DiscoverVenueListFilters,
  MarketplaceArtistListItem,
  MarketplaceVenueListItem,
  PublishedEventListItem,
} from "@/types/entities/discover.types";
import { LOCAL_PUBLISHED_EVENTS } from "@/services/event/event.local-data";
import { LOCAL_MARKETPLACE_VENUES } from "@/services/venue/venue.local-data";
import type {
  ListMarketplaceArtistsParams,
  ListMarketplaceVenuesParams,
} from "@/services/marketplace/marketplace.service.interface";
import type { ListPublishedEventsParams } from "@/contracts/event.types";
import type { PaginatedResponse } from "@/types/common/pagination.types";

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

function applyEventFilters(
  all: PublishedEventListItem[],
  f: DiscoverEventListFilters,
  taxonomyCsv?: string,
): PublishedEventListItem[] {
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
  const fromMs = f.from.trim() ? new Date(f.from).getTime() : null;
  const toMs = f.to.trim() ? new Date(f.to).getTime() : null;
  if (fromMs !== null && !Number.isNaN(fromMs)) {
    rows = rows.filter((r) => new Date(r.event.startsAt).getTime() >= fromMs);
  }
  if (toMs !== null && !Number.isNaN(toMs)) {
    rows = rows.filter((r) => new Date(r.event.startsAt).getTime() <= toMs);
  }
  if (taxonomyCsv?.trim()) {
    const ids = taxonomyCsv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (ids.length) {
      rows = rows.filter((r) => ids.some((id) => r.event.taxonomyTermIds.includes(id)));
    }
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
    from: (p?.from ?? "").trim(),
    to: (p?.to ?? "").trim(),
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
  const filtered = applyEventFilters(
    LOCAL_PUBLISHED_EVENTS,
    eventFiltersFromListParams(params),
    params?.taxonomyTermIds,
  );
  return slicePage(filtered, page, limit);
}

export async function paginateLocalVenues(
  params?: ListMarketplaceVenuesParams,
): Promise<PaginatedResponse<MarketplaceVenueListItem>> {
  await stubDelay();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 15;
  const filtered = applyVenueFilters(LOCAL_MARKETPLACE_VENUES, venueFiltersFromListParams(params));
  return slicePage(filtered, page, limit);
}

export async function paginateLocalArtists(
  params?: ListMarketplaceArtistsParams,
): Promise<PaginatedResponse<MarketplaceArtistListItem>> {
  await stubDelay();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 15;
  const all: MarketplaceArtistListItem[] = [];
  return slicePage(all, page, limit);
}
