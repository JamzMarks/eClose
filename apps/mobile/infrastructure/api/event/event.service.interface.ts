import type { EventDto, ListPublishedEventsParams } from "@/infrastructure/api/types/event.types";
import type { PaginatedResponse } from "@/infrastructure/api/types/pagination.types";

export interface IEventService {
  listPublished(
    params?: ListPublishedEventsParams,
  ): Promise<PaginatedResponse<EventDto>>;
  getPublicById(id: string): Promise<EventDto>;
}
