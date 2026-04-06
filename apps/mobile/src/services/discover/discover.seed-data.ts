import type {
  MarketplaceVenueListItem,
  PublishedEventListItem,
} from "@/services/discover/discover-list.types";
import type { EventDto } from "@/services/types/event.types";
import type { MarketplaceVenueCardDto } from "@/services/types/venue.types";

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

function eventDto(p: {
  id: string;
  title: string;
  slug: string;
  starts: Date;
  ends: Date;
  locationMode: string;
  locationLabel?: string | null;
}): EventDto {
  const now = iso(new Date());
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: null,
    locationMode: p.locationMode,
    venueId: null,
    onlineUrl: p.locationMode === "ONLINE" ? "https://example.com/live" : null,
    locationLabel: p.locationLabel ?? null,
    locationNotes: null,
    adhocAddress: null,
    startsAt: iso(p.starts),
    endsAt: iso(p.ends),
    timezone: "Europe/Lisbon",
    organizerArtistId: "mock-artist",
    taxonomyTermIds: [],
    primaryMediaAssetId: null,
    status: "PUBLISHED",
    createdAt: now,
    updatedAt: now,
  };
}

const u = (path: string) =>
  `https://images.unsplash.com/${path}?auto=format&w=640&q=75`;

/** Espaços físicos variados (dados locais quando `USE_MOCK_DISCOVER`). */
export const MOCK_EXPLORE_VENUES: MarketplaceVenueListItem[] = [
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

function nextWeekday(hour: number, dayOffset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d;
}

/** Eventos publicados (dados locais quando `USE_MOCK_DISCOVER`). */
export const MOCK_HOME_EVENTS: PublishedEventListItem[] = [
  {
    event: eventDto({
      id: "mock-e1",
      title: "Indie Night — bandas emergentes",
      slug: "indie-night",
      starts: nextWeekday(21, 2),
      ends: nextWeekday(23, 2),
      locationMode: "PHYSICAL",
      locationLabel: "Lux Frágil · Lisboa",
    }),
    primaryMediaUrl: u("photo-1459749411175-04bf5292ceea"),
    galleryUrls: [u("photo-1470229722913-7c0e2dbbafd3"), u("photo-1514525253161-7a46d19cd819")],
    categoryLabel: "Concerto",
  },
  {
    event: eventDto({
      id: "mock-e2",
      title: "DJ Set ao pôr do sol",
      slug: "dj-set-sunset",
      starts: nextWeekday(18, 3),
      ends: nextWeekday(22, 3),
      locationMode: "PHYSICAL",
      locationLabel: "Rooftop Cais · Lisboa",
    }),
    primaryMediaUrl: u("photo-1571935441008-88f0e2c6a2c5"),
    galleryUrls: [u("photo-1571266028243-e473f6f482d8"), u("photo-1519677100203-a0e668c92439")],
    categoryLabel: "DJ set",
  },
  {
    event: eventDto({
      id: "mock-e3",
      title: "Jazz quartet (streaming)",
      slug: "jazz-stream",
      starts: nextWeekday(20, 5),
      ends: nextWeekday(21, 5),
      locationMode: "ONLINE",
    }),
    primaryMediaUrl: u("photo-1511192336575-5a79af67a629"),
    galleryUrls: [u("photo-1493225457124-a3eb161ffa5f"), u("photo-1487181975056-8bc3e64e8c79")],
    categoryLabel: "Online",
  },
  {
    event: eventDto({
      id: "mock-e4",
      title: "Open mic · novos talentos",
      slug: "open-mic",
      starts: nextWeekday(19, 7),
      ends: nextWeekday(22, 7),
      locationMode: "PHYSICAL",
      locationLabel: "Jazz ao Largo · Faro",
    }),
    primaryMediaUrl: u("photo-1516280440614-37939bbacd81"),
    galleryUrls: [u("photo-1415201364774-f6f0bb35f28f"), u("photo-1598488035139-bdbb2231ce04")],
    categoryLabel: "Open mic",
  },
  {
    event: eventDto({
      id: "mock-e5",
      title: "Festival de verão — dia 1",
      slug: "festival-verao-1",
      starts: nextWeekday(14, 10),
      ends: nextWeekday(23, 10),
      locationMode: "PHYSICAL",
      locationLabel: "Arena Atlântico · Matosinhos",
    }),
    primaryMediaUrl: u("photo-1501281667655-7a57901d5227"),
    galleryUrls: [u("photo-1540039155733-5bb27b91a67e"), u("photo-1503095396549-807759245b35")],
    categoryLabel: "Festival",
  },
  {
    event: eventDto({
      id: "mock-e6",
      title: "Ópera ao ar livre",
      slug: "opera-ar-livre",
      starts: nextWeekday(20, 12),
      ends: nextWeekday(22, 12),
      locationMode: "PHYSICAL",
      locationLabel: "Teatro Villaret · Lisboa",
    }),
    primaryMediaUrl: u("photo-1514320291840-2e0a9bf2a9ae"),
    galleryUrls: [u("photo-1507003211169-0a1dd7228f2d"), u("photo-1464366400600-7198a8de8b12")],
    categoryLabel: "Clássica",
  },
];
