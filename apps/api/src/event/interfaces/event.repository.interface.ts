import { Event } from "../entity/event.entity";
import { EventStatus } from "../types/event-status.type";

export interface IEventRepository {
  save(e: Event): Promise<void>;
  findById(id: string): Promise<Event | null>;
  findBySlug(slug: string): Promise<Event | null>;
  listByArtistInRange(artistId: string, from: Date, to: Date, statuses?: EventStatus[]): Promise<Event[]>;
  listByVenueInRange(venueId: string, from: Date, to: Date, statuses?: EventStatus[]): Promise<Event[]>;
}
