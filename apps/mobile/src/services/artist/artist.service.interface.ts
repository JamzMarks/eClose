import type { ArtistDto, CreateArtistRequest } from "@/services/types/artist.types";

export interface IArtistService {
  create(body: CreateArtistRequest): Promise<ArtistDto>;
}
