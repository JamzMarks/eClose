import { Event } from "../entity/event.entity";
import { CreateEventDto } from "../dto/create-event.dto";

export interface IEventService {
  create(dto: CreateEventDto): Promise<Event>;
  getById(id: string): Promise<Event | null>;
  linkPrimaryMedia(eventId: string, mediaAssetId: string): Promise<Event>;
}
