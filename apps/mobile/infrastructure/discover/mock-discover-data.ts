import type { EventDto } from "@/infrastructure/api/types/event.types";
import type { MarketplaceVenueCardDto } from "@/infrastructure/api/types/venue.types";

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
  `https://images.unsplash.com/${path}?auto=format&w=900&q=80`;

export type ExploreVenueRow = MarketplaceVenueCardDto & { categoryLabel?: string };

export type PublishedEventRow = {
  event: EventDto;
  primaryMediaUrl: string | null;
  categoryLabel?: string;
};

/** Espaços físicos variados (mock MVP). */
export const MOCK_EXPLORE_VENUES: ExploreVenueRow[] = [
  {
    venue: venueDto("mock-v1", "Casa da Música", "casa-da-musica", "Porto", "Porto", 41.1579, -8.6291),
    primaryMediaUrl: u("photo-1514525253161-7a46d19cd819"),
    categoryLabel: "Sala de concertos",
  },
  {
    venue: venueDto("mock-v2", "Lux Frágil", "lux-fragil", "Lisboa", "Lisboa", 38.7139, -9.1394),
    primaryMediaUrl: u("photo-1571266028243-e473f6f482d8"),
    categoryLabel: "Clube / nightlife",
  },
  {
    venue: venueDto("mock-v3", "Estúdio Norte", "estudio-norte", "Braga", "Braga", 41.5454, -8.4265),
    primaryMediaUrl: u("photo-1598488035139-bdbb2231ce04"),
    categoryLabel: "Estúdio",
  },
  {
    venue: venueDto("mock-v4", "Teatro Villaret", "teatro-villaret", "Lisboa", "Lisboa", 38.7169, -9.139),
    primaryMediaUrl: u("photo-1503095396549-807759245b35"),
    categoryLabel: "Teatro",
  },
  {
    venue: venueDto("mock-v5", "Armazém F", "armazem-f", "Coimbra", "Coimbra", 40.2056, -8.4196),
    primaryMediaUrl: u("photo-1470229722913-7c0e2dbbafd3"),
    categoryLabel: "Centro de eventos",
  },
  {
    venue: venueDto("mock-v6", "Jazz ao Largo", "jazz-ao-largo", "Faro", "Faro", 37.0194, -7.9322),
    primaryMediaUrl: u("photo-1415201364774-f6f0bb35f28f"),
    categoryLabel: "Bar com palco",
  },
  {
    venue: venueDto("mock-v7", "Arena Atlântico", "arena-atlantico", "Matosinhos", "Porto", 41.1828, -8.6944),
    primaryMediaUrl: u("photo-1540039155733-5bb27b91a67e"),
    categoryLabel: "Arena",
  },
  {
    venue: venueDto("mock-v8", "Rooftop Cais", "rooftop-cais", "Lisboa", "Lisboa", 38.7076, -9.1431),
    primaryMediaUrl: u("photo-1519677100203-a0e668c92439"),
    categoryLabel: "Terraço",
  },
];

function nextWeekday(hour: number, dayOffset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d;
}

export const MOCK_HOME_EVENTS: PublishedEventRow[] = [
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
    categoryLabel: "Clássica",
  },
];
