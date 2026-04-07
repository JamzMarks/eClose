import { getApiClient } from "@/services/api-client";
import type { IVenueService } from "@/services/venue/venue.service.interface";
import type { CreateVenueRequest, VenueDto, VenueManageDto } from "@/services/types/venue.types";

export class VenueService implements IVenueService {
  private readonly client = getApiClient();

  create(body: CreateVenueRequest): Promise<VenueDto> {
    return this.client.post<VenueDto>("/venues", body);
  }

  getById(id: string): Promise<VenueDto> {
    return this.client.get<VenueDto>(`/venues/${encodeURIComponent(id)}`);
  }

  getManage(id: string): Promise<VenueManageDto> {
    return this.client.get<VenueManageDto>(
      `/venues/${encodeURIComponent(id)}/manage`,
    );
  }

  submitTrustVerification(
    id: string,
    body: {
      cnpj: string;
      cnpjDocumentMediaAssetId: string;
      addressProofMediaAssetId: string;
    },
  ): Promise<VenueManageDto> {
    return this.client.post<VenueManageDto>(
      `/venues/${encodeURIComponent(id)}/trust-verification`,
      body,
    );
  }
}
