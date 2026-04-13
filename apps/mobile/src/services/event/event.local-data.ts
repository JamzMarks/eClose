import type { PublishedEventListItem } from "@/services/discover/discover-list.types";
import type { CreateEventRequest, EventDto } from "@/services/types/event.types";

const iso = (d: Date) => d.toISOString();

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
    organizerArtistId: "local-artist",
    taxonomyTermIds: [],
    primaryMediaAssetId: null,
    status: "PUBLISHED",
    createdAt: now,
    updatedAt: now,
  };
}

const u = (path: string) =>
  `https://images.unsplash.com/${path}?auto=format&w=640&q=75`;

function nextWeekday(hour: number, dayOffset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d;
}

/** Dados estáticos para listagem/detalhe de eventos (EventService). */
export const LOCAL_PUBLISHED_EVENTS: PublishedEventListItem[] = [
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

export function findPublishedEventRowById(id: string): PublishedEventListItem | undefined {
  return LOCAL_PUBLISHED_EVENTS.find((r) => r.event.id === id);
}

export function buildLocalCreatedEvent(body: CreateEventRequest): EventDto {
  const now = new Date().toISOString();
  return {
    id: `event_local_${Date.now()}`,
    title: body.title,
    slug: body.slug,
    description: body.description ?? null,
    locationMode: body.locationMode,
    venueId: body.venueId ?? null,
    onlineUrl: body.onlineUrl ?? null,
    locationLabel: body.locationLabel ?? null,
    locationNotes: body.locationNotes ?? null,
    adhocAddress: body.adhocAddress ?? null,
    startsAt: body.startsAt,
    endsAt: body.endsAt,
    timezone: body.timezone,
    organizerArtistId: body.organizerArtistId,
    taxonomyTermIds: body.taxonomyTermIds ?? [],
    primaryMediaAssetId: null,
    status: body.status ?? "DRAFT",
    createdAt: now,
    updatedAt: now,
    primaryMediaUrl: null,
  };
}

export function buildFallbackPublicEvent(id: string): EventDto {
  const now = new Date().toISOString();
  return {
    id,
    title: "Evento (dados locais)",
    slug: "evento-local",
    description: "Sem entrada neste id na lista local.",
    locationMode: "PHYSICAL",
    venueId: null,
    onlineUrl: null,
    locationLabel: "—",
    locationNotes: null,
    adhocAddress: null,
    startsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    timezone: "Europe/Lisbon",
    organizerArtistId: "local-artist",
    taxonomyTermIds: [],
    primaryMediaAssetId: null,
    status: "PUBLISHED",
    createdAt: now,
    updatedAt: now,
    primaryMediaUrl: null,
  };
}
