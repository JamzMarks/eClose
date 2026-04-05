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
};

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
};
