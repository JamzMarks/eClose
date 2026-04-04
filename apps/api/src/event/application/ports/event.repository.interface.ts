import { Event } from "@/event/domain/entity/event.entity";
import { EventStatus } from "@/event/domain/types/event-status.type";

export type ListPublishedEventsParams = {
  from?: Date;
  to?: Date;
  taxonomyTermIds?: string[];
  venueId?: string;
  city?: string;
  q?: string;
  limit: number;
  offset: number;
  sortBy: "startsAt" | "createdAt" | "title";
  order: "ASC" | "DESC";
};

export interface IEventRepository {
  save(e: Event): Promise<void>;
  findById(id: string): Promise<Event | null>;
  findBySlug(slug: string): Promise<Event | null>;
  listByArtistInRange(artistId: string, from: Date, to: Date, statuses?: EventStatus[]): Promise<Event[]>;
  listByVenueInRange(venueId: string, from: Date, to: Date, statuses?: EventStatus[]): Promise<Event[]>;
  listPublishedFiltered(params: ListPublishedEventsParams): Promise<{ items: Event[]; total: number }>;
}
