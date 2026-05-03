import type { PublishedEventListItem } from "@/types/entities/discover.types";
import type { CreateEventRequest, EventDto, ListPublishedEventsParams } from "@/contracts/event.types";
import type { PaginatedResponse } from "@/types/common/pagination.types";

export interface IEventService {
  listPublished(
    params?: ListPublishedEventsParams,
  ): Promise<PaginatedResponse<PublishedEventListItem>>;
  getPublicById(id: string): Promise<EventDto>;
  /** GET /events/:id/organizer — autenticado, papel organizador. */
  getOrganizerView(id: string): Promise<EventDto>;
  create(body: CreateEventRequest): Promise<EventDto>;
  linkPrimaryMedia(eventId: string, mediaAssetId: string): Promise<EventDto>;
}
