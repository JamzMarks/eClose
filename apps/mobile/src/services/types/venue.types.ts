export type VenueAddressDto = {
  line1: string;
  line2?: string | null;
  neighborhood?: string | null;
  city: string;
  region: string;
  countryCode: string;
  postalCode?: string | null;
};

export type VenueVerificationStatus =
  | "none"
  | "pending_documents"
  | "pending_review"
  | "verified_l2"
  | "rejected";

export type VenueDto = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerUserId: string | null;
  address: VenueAddressDto;
  geoLat: number | null;
  geoLng: number | null;
  timezone: string;
  openingHours: unknown[];
  taxonomyTermIds: string[];
  marketplaceListed: boolean;
  openToArtistInquiries: boolean;
  primaryMediaAssetId: string | null;
  isActive: boolean;
  /** Resposta pública da API (sem CNPJ nem anexos). */
  isVerifiedL2?: boolean;
  createdAt: string;
  updatedAt: string;
};

/** GET /venues/:id/manage — dono. */
export type VenueManageDto = VenueDto & {
  verificationStatus: VenueVerificationStatus;
  cnpj: string | null;
  verificationCnpjDocMediaAssetId: string | null;
  verificationAddressProofMediaAssetId: string | null;
  hasCnpjDocument: boolean;
  hasAddressProofDocument: boolean;
  registryCheckedAt?: string | null;
};

export type MarketplaceVenueCardDto = {
  venue: VenueDto;
  primaryMediaUrl: string | null;
};

export type VenueOpeningSlotInput = {
  weekday: number;
  openLocal: string;
  closeLocal: string;
  closesNextDay?: boolean;
};

export type CreateVenueRequest = {
  name: string;
  slug: string;
  description?: string;
  ownerUserId?: string;
  address: VenueAddressDto;
  geoLat?: number;
  geoLng?: number;
  timezone: string;
  openingHours: VenueOpeningSlotInput[];
  taxonomyTermIds?: string[];
  marketplaceListed?: boolean;
  openToArtistInquiries?: boolean;
};
