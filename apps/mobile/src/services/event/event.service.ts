import { USE_MOCK_DISCOVER } from "@/services/config/discover-mode";
import { USE_API_MOCKS } from "@/services/config/api-mocks";
import type { PublishedEventListItem } from "@/services/discover/discover-list.types";
import { paginateLocalPublishedEvents } from "@/services/discover/discover.stub-pagination";
import { getApiClient } from "@/services/api-client";
import type { IEventService } from "@/services/event/event.service.interface";
import type { CreateEventRequest, EventDto, ListPublishedEventsParams } from "@/services/types/event.types";
import type { PaginatedResponse } from "@/services/types/pagination.types";
import { toQueryString } from "@/services/utils/query-string";

export class EventService implements IEventService {
  private readonly client = getApiClient();

  listPublished(
    params?: ListPublishedEventsParams,
  ): Promise<PaginatedResponse<PublishedEventListItem>> {
    if (USE_API_MOCKS) {
      return paginateLocalPublishedEvents(params);
    }
    if (USE_MOCK_DISCOVER) {
      return paginateLocalPublishedEvents(params);
    }

    const discoveryLocationMode = params?.discoveryLocationMode;
    const q = toQueryString({
      from: params?.from,
      to: params?.to,
      taxonomyTermIds: params?.taxonomyTermIds,
      venueId: params?.venueId,
      city: params?.city,
      q: params?.q,
      page: params?.page,
      limit: params?.limit,
      sortBy: params?.sortBy,
      order: params?.order,
    });

    return this.client
      .get<PaginatedResponse<EventDto>>(`/events${q}`)
      .then((res) => {
        let items: PublishedEventListItem[] = res.items.map((event) => ({
          event,
          primaryMediaUrl: event.primaryMediaUrl ?? null,
          galleryUrls: undefined,
        }));
        if (discoveryLocationMode === "PHYSICAL") {
          items = items.filter((r) => r.event.locationMode === "PHYSICAL");
        } else if (discoveryLocationMode === "ONLINE") {
          items = items.filter((r) => r.event.locationMode === "ONLINE");
        }
        return { ...res, items };
      });
  }

  getPublicById(id: string): Promise<EventDto> {
    if (USE_API_MOCKS) {
      return Promise.resolve({
        id,
        title: "Mock Event",
        slug: "mock-event",
        description: "Evento mockado (sem API).",
        locationMode: "PHYSICAL",
        venueId: "venue_mock_1",
        onlineUrl: null,
        locationLabel: "Mock Venue",
        locationNotes: null,
        adhocAddress: null,
        startsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        timezone: "America/Sao_Paulo",
        organizerArtistId: "artist_mock_1",
        taxonomyTermIds: [],
        primaryMediaAssetId: null,
        status: "PUBLISHED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        primaryMediaUrl: null,
      });
    }

    // return this.client.get<EventDto>(`/events/${encodeURIComponent(id)}`);
    return this.client.get<EventDto>(`/events/${encodeURIComponent(id)}`);
  }

  create(body: CreateEventRequest): Promise<EventDto> {
    if (USE_API_MOCKS) {
      return Promise.resolve({
        id: `event_mock_${Date.now()}`,
        title: body.title,
        slug: body.slug,
        description: body.description ?? null,
        locationMode: body.locationMode,
        venueId: body.venueId ?? null,
        onlineUrl: body.onlineUrl ?? null,
        locationLabel: body.locationLabel ?? null,
        locationNotes: body.locationNotes ?? null,
        adhocAddress: body.adhocAddress ?? null,
        startsAt: body.startsAt,
        endsAt: body.endsAt,
        timezone: body.timezone,
        organizerArtistId: body.organizerArtistId,
        taxonomyTermIds: body.taxonomyTermIds ?? [],
        primaryMediaAssetId: null,
        status: body.status ?? "DRAFT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        primaryMediaUrl: null,
      });
    }

    // return this.client.post<EventDto>("/events", body);
    return this.client.post<EventDto>("/events", body);
  }
}
