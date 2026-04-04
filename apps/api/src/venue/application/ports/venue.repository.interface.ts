import { Venue } from "@/venue/domain/entity/venue.entity";

export interface IVenueRepository {
  save(venue: Venue): Promise<void>;
  findById(id: string): Promise<Venue | null>;
  findBySlug(slug: string): Promise<Venue | null>;
  listActive(): Promise<Venue[]>;
  /** Espaços activos e visíveis no catálogo público (marketplace). */
  listMarketplaceListedActive(): Promise<Venue[]>;
  findMarketplaceListedById(id: string): Promise<Venue | null>;
}
