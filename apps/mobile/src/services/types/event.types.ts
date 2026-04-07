/** Resposta JSON de evento (datas ISO string). */
export type EventDto = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  locationMode: string;
  venueId: string | null;
  onlineUrl: string | null;
  locationLabel: string | null;
  locationNotes: string | null;
  adhocAddress: Record<string, unknown> | null;
  startsAt: string;
  endsAt: string;
  timezone: string;
  organizerArtistId: string;
  taxonomyTermIds: string[];
  primaryMediaAssetId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  /** Presente nas respostas públicas quando a API enriquece a listagem/detalhe. */
  primaryMediaUrl?: string | null;
};

export type DiscoveryLocationModeFilter = "ALL" | "PHYSICAL" | "ONLINE";

export type ListPublishedEventsParams = {
  from?: string;
  to?: string;
  taxonomyTermIds?: string;
  venueId?: string;
  city?: string;
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: "startsAt" | "createdAt" | "title";
  order?: "ASC" | "DESC";
  /** Filtro da listagem (mock e cliente se a API não filtrar). */
  discoveryLocationMode?: DiscoveryLocationModeFilter;
};

export type CreateEventRequest = {
  title: string;
  slug: string;
  description?: string;
  locationMode: "PHYSICAL" | "ONLINE" | "HYBRID";
  venueId?: string;
  onlineUrl?: string;
  locationLabel?: string;
  locationNotes?: string;
  adhocAddress?: Record<string, unknown>;
  startsAt: string;
  endsAt: string;
  timezone: string;
  organizerArtistId: string;
  taxonomyTermIds?: string[];
  status?: "DRAFT" | "PUBLISHED" | "CANCELLED";
};
