import { getApiClient } from "@/infrastructure/api/api-client";
import type { IEventService } from "@/infrastructure/api/event/event.service.interface";
import type { EventDto, ListPublishedEventsParams } from "@/infrastructure/api/types/event.types";
import type { PaginatedResponse } from "@/infrastructure/api/types/pagination.types";
import { toQueryString } from "@/infrastructure/api/utils/query-string";

export class EventService implements IEventService {
  private readonly client = getApiClient();

  listPublished(
    params?: ListPublishedEventsParams,
  ): Promise<PaginatedResponse<EventDto>> {
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
    return this.client.get<PaginatedResponse<EventDto>>(`/events${q}`);
  }

  getPublicById(id: string): Promise<EventDto> {
    return this.client.get<EventDto>(`/events/${encodeURIComponent(id)}`);
  }
}
