export type CreateArtistRequest = {
  name: string;
  slug: string;
  type: "SOLO" | "BAND" | "COLLECTIVE";
  ownerId: string;
  headline?: string;
  bio?: string;
  websiteUrl?: string;
  marketplaceVisible?: boolean;
  openToVenueBookings?: boolean;
  taxonomyTermIds?: string[];
};

export type ArtistDto = {
  id: string;
  name: string;
  slug: string;
  type: string;
  ownerId: string;
  headline: string | null;
  bio: string | null;
  websiteUrl: string | null;
  marketplaceVisible: boolean;
  openToVenueBookings: boolean;
  taxonomyTermIds: string[];
  primaryMediaAssetId: string | null;
  createdAt: string;
  isActive: boolean;
};
