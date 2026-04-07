import { USE_MOCK_DISCOVER } from "@/services/config/discover-mode";
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
    return this.client.get<EventDto>(`/events/${encodeURIComponent(id)}`);
  }

  create(body: CreateEventRequest): Promise<EventDto> {
    return this.client.post<EventDto>("/events", body);
  }
}
