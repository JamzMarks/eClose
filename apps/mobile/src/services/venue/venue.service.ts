import { getApiClient } from "@/services/api-client";
import { USE_API_MOCKS } from "@/services/config/api-mocks";
import type { IVenueService } from "@/services/venue/venue.service.interface";
import type { CreateVenueRequest, VenueDto, VenueManageDto } from "@/services/types/venue.types";

export class VenueService implements IVenueService {
  private readonly client = getApiClient();

  create(body: CreateVenueRequest): Promise<VenueDto> {
    if (USE_API_MOCKS) {
      const now = new Date().toISOString();
      return Promise.resolve({
        id: `venue_mock_${Date.now()}`,
        name: body.name,
        slug: body.slug,
        description: body.description ?? null,
        ownerUserId: body.ownerUserId ?? null,
        address: body.address,
        geoLat: body.geoLat ?? null,
        geoLng: body.geoLng ?? null,
        timezone: body.timezone,
        openingHours: [],
        taxonomyTermIds: body.taxonomyTermIds ?? [],
        marketplaceListed: body.marketplaceListed ?? false,
        openToArtistInquiries: body.openToArtistInquiries ?? false,
        primaryMediaAssetId: null,
        isActive: true,
        isVerifiedL2: false,
        createdAt: now,
        updatedAt: now,
      });
    }

    // return this.client.post<VenueDto>("/venues", body);
    return this.client.post<VenueDto>("/venues", body);
  }

  getById(id: string): Promise<VenueDto> {
    if (USE_API_MOCKS) {
      const now = new Date().toISOString();
      return Promise.resolve({
        id,
        name: "Mock Venue",
        slug: "mock-venue",
        description: "Venue mockada (sem API).",
        ownerUserId: "user_mock_1",
        address: {
          line1: "Rua Mock, 123",
          line2: null,
          neighborhood: "Centro",
          city: "São Paulo",
          region: "SP",
          countryCode: "BR",
          postalCode: "01000-000",
        },
        geoLat: -23.55052,
        geoLng: -46.633308,
        timezone: "America/Sao_Paulo",
        openingHours: [],
        taxonomyTermIds: [],
        marketplaceListed: true,
        openToArtistInquiries: true,
        primaryMediaAssetId: null,
        isActive: true,
        isVerifiedL2: false,
        createdAt: now,
        updatedAt: now,
      });
    }

    // return this.client.get<VenueDto>(`/venues/${encodeURIComponent(id)}`);
    return this.client.get<VenueDto>(`/venues/${encodeURIComponent(id)}`);
  }

  getManage(id: string): Promise<VenueManageDto> {
    if (USE_API_MOCKS) {
      const now = new Date().toISOString();
      return Promise.resolve({
        id,
        name: "Mock Venue (Manage)",
        slug: "mock-venue",
        description: "Venue mockada (manage).",
        ownerUserId: "user_mock_1",
        address: {
          line1: "Rua Mock, 123",
          line2: null,
          neighborhood: "Centro",
          city: "São Paulo",
          region: "SP",
          countryCode: "BR",
          postalCode: "01000-000",
        },
        geoLat: -23.55052,
        geoLng: -46.633308,
        timezone: "America/Sao_Paulo",
        openingHours: [],
        taxonomyTermIds: [],
        marketplaceListed: true,
        openToArtistInquiries: true,
        primaryMediaAssetId: null,
        isActive: true,
        isVerifiedL2: false,
        createdAt: now,
        updatedAt: now,
        verificationStatus: "pending_review",
        cnpj: "12.345.678/0001-90",
        verificationCnpjDocMediaAssetId: "media_mock_cnpj_doc",
        verificationAddressProofMediaAssetId: "media_mock_address_proof",
        hasCnpjDocument: true,
        hasAddressProofDocument: true,
        registryCheckedAt: null,
      });
    }

    // return this.client.get<VenueManageDto>(`/venues/${encodeURIComponent(id)}/manage`);
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
    if (USE_API_MOCKS) {
      const now = new Date().toISOString();
      return Promise.resolve({
        id,
        name: "Mock Venue (Trust Verification)",
        slug: "mock-venue",
        description: "Venue mockada (trust verification).",
        ownerUserId: "user_mock_1",
        address: {
          line1: "Rua Mock, 123",
          line2: null,
          neighborhood: "Centro",
          city: "São Paulo",
          region: "SP",
          countryCode: "BR",
          postalCode: "01000-000",
        },
        geoLat: -23.55052,
        geoLng: -46.633308,
        timezone: "America/Sao_Paulo",
        openingHours: [],
        taxonomyTermIds: [],
        marketplaceListed: true,
        openToArtistInquiries: true,
        primaryMediaAssetId: null,
        isActive: true,
        isVerifiedL2: false,
        createdAt: now,
        updatedAt: now,
        verificationStatus: "pending_documents",
        cnpj: body.cnpj,
        verificationCnpjDocMediaAssetId: body.cnpjDocumentMediaAssetId,
        verificationAddressProofMediaAssetId: body.addressProofMediaAssetId,
        hasCnpjDocument: true,
        hasAddressProofDocument: true,
        registryCheckedAt: null,
      });
    }

    // return this.client.post<VenueManageDto>(`/venues/${encodeURIComponent(id)}/trust-verification`, body);
    return this.client.post<VenueManageDto>(
      `/venues/${encodeURIComponent(id)}/trust-verification`,
      body,
    );
  }
}
