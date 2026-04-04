import { Venue } from "@/venue/domain/entity/venue.entity";
import { CreateVenueDto } from "@/venue/interface/http/dto/create-venue.dto";

export interface IVenueService {
  create(dto: CreateVenueDto): Promise<Venue>;
  getById(id: string): Promise<Venue | null>;
  listActive(): Promise<Venue[]>;
  linkPrimaryMedia(venueId: string, mediaAssetId: string): Promise<Venue>;
}
