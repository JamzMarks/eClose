import type { VenueDto } from "@/services/types/venue.types";

export interface IVenueService {
  getById(id: string): Promise<VenueDto>;
}
