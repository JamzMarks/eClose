import { USE_LOCAL_SERVICE_DATA } from "@/services/config/service-data-source";
import type { PublishedEventListItem } from "@/types/entities/discover.types";
import { paginateLocalPublishedEvents } from "@/services/discover/discover.stub-pagination";
import { getApiClient } from "@/services/api-client";
import {
  buildFallbackPublicEvent,
  buildLocalCreatedEvent,
  findPublishedEventRowById,
} from "@/services/event/event.local-data";
import type { IEventService } from "@/services/event/event.service.interface";
import type { CreateEventRequest, EventDto, ListPublishedEventsParams } from "@/contracts/event.types";
import type { PaginatedResponse } from "@/types/common/pagination.types";
import { toQueryString } from "@/services/utils/query-string";

export class EventService implements IEventService {
  private readonly client = getApiClient();

  listPublished(
    params?: ListPublishedEventsParams,
  ): Promise<PaginatedResponse<PublishedEventListItem>> {
    if (USE_LOCAL_SERVICE_DATA) {
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
    if (USE_LOCAL_SERVICE_DATA) {
      const row = findPublishedEventRowById(id);
      if (row) {
        return Promise.resolve({
          ...row.event,
          primaryMediaUrl: row.primaryMediaUrl ?? row.event.primaryMediaUrl ?? null,
        });
      }
      return Promise.resolve(buildFallbackPublicEvent(id));
    }

    return this.client.get<EventDto>(`/events/${encodeURIComponent(id)}`);
  }

  getOrganizerView(id: string): Promise<EventDto> {
    if (USE_LOCAL_SERVICE_DATA) {
      return this.getPublicById(id);
    }
    return this.client.get<EventDto>(`/events/${encodeURIComponent(id)}/organizer`);
  }

  linkPrimaryMedia(eventId: string, mediaAssetId: string): Promise<EventDto> {
    if (USE_LOCAL_SERVICE_DATA) {
      return this.getPublicById(eventId);
    }
    return this.client.patch<EventDto>(`/events/${encodeURIComponent(eventId)}/primary-media`, {
      mediaAssetId,
    });
  }

  create(body: CreateEventRequest): Promise<EventDto> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve(buildLocalCreatedEvent(body));
    }

    return this.client.post<EventDto>("/events", body);
  }
}
