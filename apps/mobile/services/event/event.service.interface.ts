import type { EventDto, ListPublishedEventsParams } from "@/services/types/event.types";
import type { PaginatedResponse } from "@/services/types/pagination.types";

export interface IEventService {
  listPublished(
    params?: ListPublishedEventsParams,
  ): Promise<PaginatedResponse<EventDto>>;
  getPublicById(id: string): Promise<EventDto>;
}
