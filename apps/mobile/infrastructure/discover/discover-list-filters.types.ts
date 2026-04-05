export type EventLocationModeFilter = "ALL" | "PHYSICAL" | "ONLINE";

export type DiscoverEventListFilters = {
  city: string;
  locationMode: EventLocationModeFilter;
  sortBy: "startsAt" | "title";
  order: "ASC" | "DESC";
  query: string;
};

export type DiscoverVenueListFilters = {
  city: string;
  region: string;
  sortBy: "name" | "city";
  order: "ASC" | "DESC";
  openToInquiriesOnly: boolean;
};

export const defaultDiscoverEventFilters = (): DiscoverEventListFilters => ({
  city: "",
  locationMode: "ALL",
  sortBy: "startsAt",
  order: "ASC",
  query: "",
});

export const defaultDiscoverVenueFilters = (): DiscoverVenueListFilters => ({
  city: "",
  region: "",
  sortBy: "name",
  order: "ASC",
  openToInquiriesOnly: false,
});
