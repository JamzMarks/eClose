import type { VenueDto } from "@/infrastructure/api/types/venue.types";

export interface IVenueService {
  getById(id: string): Promise<VenueDto>;
}
