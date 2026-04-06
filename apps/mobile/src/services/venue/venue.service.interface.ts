import type { VenueDto, VenueManageDto } from "@/services/types/venue.types";

export interface IVenueService {
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
}
