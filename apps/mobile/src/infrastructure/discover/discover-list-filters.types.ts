export type EventLocationModeFilter = "ALL" | "PHYSICAL" | "ONLINE";

/** Filtros de listagem — ordenação fixa na API/mock (data para eventos, nome para espaços). */
export type DiscoverEventListFilters = {
  city: string;
  locationMode: EventLocationModeFilter;
  query: string;
};

export type DiscoverVenueListFilters = {
  city: string;
  region: string;
  openToInquiriesOnly: boolean;
};

export const defaultDiscoverEventFilters = (): DiscoverEventListFilters => ({
  city: "",
  locationMode: "ALL",
  query: "",
});

export const defaultDiscoverVenueFilters = (): DiscoverVenueListFilters => ({
  city: "",
  region: "",
  openToInquiriesOnly: false,
});
