import { getApiClient } from "@/services/api-client";
import type { IVenueService } from "@/services/venue/venue.service.interface";
import type { VenueDto } from "@/services/types/venue.types";

export class VenueService implements IVenueService {
  private readonly client = getApiClient();

  getById(id: string): Promise<VenueDto> {
    return this.client.get<VenueDto>(`/venues/${encodeURIComponent(id)}`);
  }
}
