import { Artist } from "../entity/artist.entity";

export interface IArtistRepository {
  save(artist: Artist): Promise<void>;
  findById(id: string): Promise<Artist | null>;
  findBySlug(slug: string): Promise<Artist | null>;
  listAll(): Promise<Artist[]>;
}
