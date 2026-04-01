import { Venue } from "../entity/venue.entity";
import { CreateVenueDto } from "../dto/create-venue.dto";

export interface IVenueService {
  create(dto: CreateVenueDto): Promise<Venue>;
  getById(id: string): Promise<Venue | null>;
  listActive(): Promise<Venue[]>;
  linkPrimaryMedia(venueId: string, mediaAssetId: string): Promise<Venue>;
}
