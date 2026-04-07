import type { PublishedEventListItem } from "@/services/discover/discover-list.types";
import type { CreateEventRequest, EventDto, ListPublishedEventsParams } from "@/services/types/event.types";
import type { PaginatedResponse } from "@/services/types/pagination.types";

export interface IEventService {
  listPublished(
    params?: ListPublishedEventsParams,
  ): Promise<PaginatedResponse<PublishedEventListItem>>;
  getPublicById(id: string): Promise<EventDto>;
  create(body: CreateEventRequest): Promise<EventDto>;
}
