import { Event } from "@/event/domain/entity/event.entity";

export type CalendarRangeQuery = {
  fromIso: string;
  toIso: string;
};

export type PublishWindowInput = {
  organizerArtistId: string;
  venueId: string | null;
  startsAt: Date;
  endsAt: Date;
};

export type SuggestSlotsQuery = {
  fromIso: string;
  toIso: string;
  durationMinutes?: number;
  stepMinutes?: number;
  venueId?: string | null;
  /** Ref. futura para mapear conta Google/Outlook via ExternalCalendarPort */
  externalCalendarOwnerRef?: string | null;
};

/**
 * Visão unificada de agenda para artistas e venues (conflitos, recomendações, UX de criação).
 * Evolui com bloqueios internos do artista, regras de venue e integração externa (Google Calendar).
 */
export interface ICalendarService {
  getArtistPublicSchedule(artistId: string, range: CalendarRangeQuery): Promise<Event[]>;
  getVenueSchedule(venueId: string, range: CalendarRangeQuery): Promise<Event[]>;
  hasArtistConflict(artistId: string, startsAt: Date, endsAt: Date): Promise<boolean>;
  hasVenueConflict(venueId: string, startsAt: Date, endsAt: Date): Promise<boolean>;
  validateNoConflictForPublish(input: PublishWindowInput): Promise<void>;
  suggestFreeSlots(
    artistId: string,
    query: SuggestSlotsQuery,
  ): Promise<Array<{ startsAt: string; endsAt: string }>>;
  addArtistUnavailability(
    artistId: string,
    startsAt: Date,
    endsAt: Date,
    reason?: string | null,
  ): Promise<{ id: string }>;
  addVenueUnavailability(
    venueId: string,
    startsAt: Date,
    endsAt: Date,
    reason?: string | null,
  ): Promise<{ id: string }>;
}
