import { getApiClient } from "@/services/api-client";
import { USE_LOCAL_SERVICE_DATA } from "@/services/config/service-data-source";
import { findMarketplaceVenueRowById } from "@/services/venue/venue.local-data";
import type { IVenueService } from "@/services/venue/venue.service.interface";
import type { CreateVenueRequest, VenueDto, VenueManageDto } from "@/services/types/venue.types";

export class VenueService implements IVenueService {
  private readonly client = getApiClient();

  create(body: CreateVenueRequest): Promise<VenueDto> {
    if (USE_LOCAL_SERVICE_DATA) {
      const now = new Date().toISOString();
      return Promise.resolve({
        id: `venue_local_${Date.now()}`,
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

    return this.client.post<VenueDto>("/venues", body);
  }

  getById(id: string): Promise<VenueDto> {
    if (USE_LOCAL_SERVICE_DATA) {
      const row = findMarketplaceVenueRowById(id);
      if (row) {
        return Promise.resolve({ ...row.venue });
      }
      const now = new Date().toISOString();
      return Promise.resolve({
        id,
        name: "Espaço (dados locais)",
        slug: "espaco-local",
        description: "Sem entrada neste id na lista local.",
        ownerUserId: null,
        address: {
          line1: "—",
          line2: null,
          neighborhood: null,
          city: "—",
          region: "—",
          countryCode: "PT",
          postalCode: null,
        },
        geoLat: null,
        geoLng: null,
        timezone: "Europe/Lisbon",
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

    return this.client.get<VenueDto>(`/venues/${encodeURIComponent(id)}`);
  }

  getManage(id: string): Promise<VenueManageDto> {
    if (USE_LOCAL_SERVICE_DATA) {
      const row = findMarketplaceVenueRowById(id);
      const base = row?.venue;
      const now = new Date().toISOString();
      return Promise.resolve({
        id,
        name: base?.name ?? "Gestão (dados locais)",
        slug: base?.slug ?? "gestao-local",
        description: base?.description ?? null,
        ownerUserId: base?.ownerUserId ?? null,
        address:
          base?.address ?? {
            line1: "—",
            line2: null,
            neighborhood: null,
            city: "—",
            region: "—",
            countryCode: "PT",
            postalCode: null,
          },
        geoLat: base?.geoLat ?? null,
        geoLng: base?.geoLng ?? null,
        timezone: base?.timezone ?? "Europe/Lisbon",
        openingHours: base?.openingHours ?? [],
        taxonomyTermIds: base?.taxonomyTermIds ?? [],
        marketplaceListed: base?.marketplaceListed ?? true,
        openToArtistInquiries: base?.openToArtistInquiries ?? true,
        primaryMediaAssetId: base?.primaryMediaAssetId ?? null,
        isActive: base?.isActive ?? true,
        isVerifiedL2: base?.isVerifiedL2 ?? false,
        createdAt: base?.createdAt ?? now,
        updatedAt: now,
        verificationStatus: "pending_review",
        cnpj: "12.345.678/0001-90",
        verificationCnpjDocMediaAssetId: "media_local_cnpj_doc",
        verificationAddressProofMediaAssetId: "media_local_address_proof",
        hasCnpjDocument: true,
        hasAddressProofDocument: true,
        registryCheckedAt: null,
      });
    }

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
    if (USE_LOCAL_SERVICE_DATA) {
      const row = findMarketplaceVenueRowById(id);
      const base = row?.venue;
      const now = new Date().toISOString();
      return Promise.resolve({
        id,
        name: base?.name ?? "Verificação (dados locais)",
        slug: base?.slug ?? "verificacao-local",
        description: base?.description ?? null,
        ownerUserId: base?.ownerUserId ?? null,
        address:
          base?.address ?? {
            line1: "—",
            line2: null,
            neighborhood: null,
            city: "—",
            region: "—",
            countryCode: "PT",
            postalCode: null,
          },
        geoLat: base?.geoLat ?? null,
        geoLng: base?.geoLng ?? null,
        timezone: base?.timezone ?? "Europe/Lisbon",
        openingHours: base?.openingHours ?? [],
        taxonomyTermIds: base?.taxonomyTermIds ?? [],
        marketplaceListed: base?.marketplaceListed ?? true,
        openToArtistInquiries: base?.openToArtistInquiries ?? true,
        primaryMediaAssetId: base?.primaryMediaAssetId ?? null,
        isActive: base?.isActive ?? true,
        isVerifiedL2: base?.isVerifiedL2 ?? false,
        createdAt: base?.createdAt ?? now,
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

    return this.client.post<VenueManageDto>(
      `/venues/${encodeURIComponent(id)}/trust-verification`,
      body,
    );
  }

  linkPrimaryMedia(venueId: string, mediaAssetId: string): Promise<VenueDto> {
    if (USE_LOCAL_SERVICE_DATA) {
      return this.getById(venueId);
    }
    return this.client.patch<VenueDto>(`/venues/${encodeURIComponent(venueId)}/primary-media`, {
      mediaAssetId,
    });
  }
}
