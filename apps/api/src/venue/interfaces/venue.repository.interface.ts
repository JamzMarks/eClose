import { Venue } from "../entity/venue.entity";

export interface IVenueRepository {
  save(venue: Venue): Promise<void>;
  findById(id: string): Promise<Venue | null>;
  findBySlug(slug: string): Promise<Venue | null>;
  listActive(): Promise<Venue[]>;
}
