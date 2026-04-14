import type { CreateVenueRequest, VenueDto, VenueManageDto } from "@/services/types/venue.types";

export interface IVenueService {
  create(body: CreateVenueRequest): Promise<VenueDto>;
  getById(id: string): Promise<VenueDto>;
  getManage(id: string): Promise<VenueManageDto>;
  submitTrustVerification(
    id: string,
    body: {
      cnpj: string;
      cnpjDocumentMediaAssetId: string;
      addressProofMediaAssetId: string;
    },
  ): Promise<VenueManageDto>;
  linkPrimaryMedia(venueId: string, mediaAssetId: string): Promise<VenueDto>;
}
