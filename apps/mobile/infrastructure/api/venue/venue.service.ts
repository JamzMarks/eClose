import { getApiClient } from "@/infrastructure/api/api-client";
import type { IVenueService } from "@/infrastructure/api/venue/venue.service.interface";
import type { VenueDto } from "@/infrastructure/api/types/venue.types";

export class VenueService implements IVenueService {
  private readonly client = getApiClient();

  getById(id: string): Promise<VenueDto> {
    return this.client.get<VenueDto>(`/venues/${encodeURIComponent(id)}`);
  }
}
