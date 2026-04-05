export type VenueAddressDto = {
  line1: string;
  line2?: string | null;
  neighborhood?: string | null;
  city: string;
  region: string;
  countryCode: string;
  postalCode?: string | null;
};

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
  createdAt: string;
  updatedAt: string;
};

export type MarketplaceVenueCardDto = {
  venue: VenueDto;
  primaryMediaUrl: string | null;
};
