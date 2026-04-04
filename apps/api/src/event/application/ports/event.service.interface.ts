import { Event } from "@/event/domain/entity/event.entity";
import { CreateEventDto } from "@/event/interface/http/dto/create-event.dto";
import { ListPublishedEventsParams } from "./event.repository.interface";

export interface IEventService {
  create(dto: CreateEventDto): Promise<Event>;
  getById(id: string): Promise<Event | null>;
  getPublicById(id: string): Promise<Event | null>;
  listPublishedPublic(
    params: Omit<ListPublishedEventsParams, "limit" | "offset" | "sortBy" | "order"> & {
      page?: number;
      limit?: number;
      sortBy?: ListPublishedEventsParams["sortBy"];
      order?: ListPublishedEventsParams["order"];
    },
  ): Promise<{ items: Event[]; total: number; page: number; limit: number }>;
  linkPrimaryMedia(eventId: string, mediaAssetId: string): Promise<Event>;
}
