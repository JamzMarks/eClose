import type { MarketplaceVenueListItem } from "@/types/entities/discover.types";
import type { MarketplaceVenueCardDto } from "@/contracts/venue.types";

const iso = (d: Date) => d.toISOString();

function venueDto(
  id: string,
  name: string,
  slug: string,
  city: string,
  region: string,
  geoLat: number,
  geoLng: number,
): MarketplaceVenueCardDto["venue"] {
  const now = iso(new Date());
  return {
    id,
    name,
    slug,
    description: null,
    ownerUserId: null,
    address: {
      line1: "Rua do exemplo 1",
      line2: null,
      neighborhood: null,
      city,
      region,
      countryCode: "PT",
      postalCode: "1000-001",
    },
    geoLat,
    geoLng,
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
  };
}

const u = (path: string) =>
  `https://images.unsplash.com/${path}?auto=format&w=640&q=75`;

/** Dados estáticos para cards de venues / marketplace (VenueService, MarketplaceService). */
export const LOCAL_MARKETPLACE_VENUES: MarketplaceVenueListItem[] = [
  {
    venue: {
      ...venueDto("mock-v1", "Casa da Música", "casa-da-musica", "Porto", "Porto", 41.1579, -8.6291),
      isVerifiedL2: true,
    },
    primaryMediaUrl: u("photo-1514525253161-7a46d19cd819"),
    galleryUrls: [u("photo-1493225457124-a3eb161ffa5f"), u("photo-1511671782779-b29710aed9fc")],
    categoryLabel: "Sala de concertos",
  },
  {
    venue: venueDto("mock-v2", "Lux Frágil", "lux-fragil", "Lisboa", "Lisboa", 38.7139, -9.1394),
    primaryMediaUrl: u("photo-1571266028243-e473f6f482d8"),
    galleryUrls: [u("photo-1563841930606-67e2bbe657ef"), u("photo-1545128485-c400e7702796")],
    categoryLabel: "Clube / nightlife",
  },
  {
    venue: venueDto("mock-v3", "Estúdio Norte", "estudio-norte", "Braga", "Braga", 41.5454, -8.4265),
    primaryMediaUrl: u("photo-1598488035139-bdbb2231ce04"),
    galleryUrls: [u("photo-1598653222000-6b7b7a552625"), u("photo-1511379938547-c1f69419868d")],
    categoryLabel: "Estúdio",
  },
  {
    venue: venueDto("mock-v4", "Teatro Villaret", "teatro-villaret", "Lisboa", "Lisboa", 38.7169, -9.139),
    primaryMediaUrl: u("photo-1503095396549-807759245b35"),
    galleryUrls: [u("photo-1507003211169-0a1dd7228f2d"), u("photo-1464366400600-7198a8de8b12")],
    categoryLabel: "Teatro",
  },
  {
    venue: venueDto("mock-v5", "Armazém F", "armazem-f", "Coimbra", "Coimbra", 40.2056, -8.4196),
    primaryMediaUrl: u("photo-1470229722913-7c0e2dbbafd3"),
    galleryUrls: [u("photo-1429962714451-bb934ecdc4ec"), u("photo-1533174072545-7a4b6ad7a6c3")],
    categoryLabel: "Centro de eventos",
  },
  {
    venue: venueDto("mock-v6", "Jazz ao Largo", "jazz-ao-largo", "Faro", "Faro", 37.0194, -7.9322),
    primaryMediaUrl: u("photo-1415201364774-f6f0bb35f28f"),
    galleryUrls: [u("photo-1487181975056-8bc3e64e8c79"), u("photo-1514320291840-2e0a9bf2a9ae")],
    categoryLabel: "Bar com palco",
  },
  {
    venue: venueDto("mock-v7", "Arena Atlântico", "arena-atlantico", "Matosinhos", "Porto", 41.1828, -8.6944),
    primaryMediaUrl: u("photo-1540039155733-5bb27b91a67e"),
    galleryUrls: [u("photo-1506157786151-b8491531f063"), u("photo-1524368535928-5b5e00ddc76b")],
    categoryLabel: "Arena",
  },
  {
    venue: venueDto("mock-v8", "Rooftop Cais", "rooftop-cais", "Lisboa", "Lisboa", 38.7076, -9.1431),
    primaryMediaUrl: u("photo-1519677100203-a0e668c92439"),
    galleryUrls: [u("photo-1514933651103-005eec06c04b"), u("photo-1558618666-fcd25c85cd64")],
    categoryLabel: "Terraço",
  },
];

export function findMarketplaceVenueRowById(id: string): MarketplaceVenueListItem | undefined {
  return LOCAL_MARKETPLACE_VENUES.find((r) => r.venue.id === id);
}
