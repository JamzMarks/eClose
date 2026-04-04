import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { ArtistUnavailabilityOrmEntity } from "@/calendar/infrastructure/persistence/artist-unavailability.orm-entity";
import { VenueUnavailabilityOrmEntity } from "@/calendar/infrastructure/persistence/venue-unavailability.orm-entity";
import {
  EXTERNAL_CALENDAR_PORT,
  ExternalCalendarPort,
} from "@/calendar/application/ports/external-calendar.port";
import { Event } from "@/event/domain/entity/event.entity";
import { IEventRepository } from "@/event/application/ports/event.repository.interface";
import { EVENT_REPOSITORY } from "@/event/application/tokens/event.tokens";
import { EventStatus } from "@/event/domain/types/event-status.type";
import {
  CalendarRangeQuery,
  ICalendarService,
  PublishWindowInput,
  SuggestSlotsQuery,
} from "@/calendar/interfaces/calendar.service.interface";

const MAX_SUGGESTED_SLOTS = 48;

@Injectable()
export class CalendarService implements ICalendarService {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly events: IEventRepository,
    @InjectRepository(ArtistUnavailabilityOrmEntity)
    private readonly artistUnavail: Repository<ArtistUnavailabilityOrmEntity>,
    @InjectRepository(VenueUnavailabilityOrmEntity)
    private readonly venueUnavail: Repository<VenueUnavailabilityOrmEntity>,
    @Inject(EXTERNAL_CALENDAR_PORT)
    private readonly externalCalendar: ExternalCalendarPort,
  ) {}

  private parseRange(range: CalendarRangeQuery): { from: Date; to: Date } {
    const from = new Date(range.fromIso);
    const to = new Date(range.toIso);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new BadRequestException("Intervalo de datas inválido (use ISO-8601)");
    }
    if (to <= from) throw new BadRequestException("`to` deve ser posterior a `from`");
    return { from, to };
  }

  async getArtistPublicSchedule(artistId: string, range: CalendarRangeQuery): Promise<Event[]> {
    const { from, to } = this.parseRange(range);
    return this.events.listByArtistInRange(artistId, from, to, [EventStatus.PUBLISHED]);
  }

  async getVenueSchedule(venueId: string, range: CalendarRangeQuery): Promise<Event[]> {
    const { from, to } = this.parseRange(range);
    return this.events.listByVenueInRange(venueId, from, to, [EventStatus.PUBLISHED]);
  }

  async hasArtistConflict(artistId: string, startsAt: Date, endsAt: Date): Promise<boolean> {
    const hits = await this.events.listByArtistInRange(artistId, startsAt, endsAt, [
      EventStatus.PUBLISHED,
    ]);
    return hits.length > 0;
  }

  async hasVenueConflict(venueId: string, startsAt: Date, endsAt: Date): Promise<boolean> {
    const hits = await this.events.listByVenueInRange(venueId, startsAt, endsAt, [
      EventStatus.PUBLISHED,
    ]);
    return hits.length > 0;
  }

  async validateNoConflictForPublish(input: PublishWindowInput): Promise<void> {
    if (input.endsAt <= input.startsAt) {
      throw new BadRequestException("Intervalo de publicação inválido");
    }
    if (await this.hasArtistConflict(input.organizerArtistId, input.startsAt, input.endsAt)) {
      throw new BadRequestException(
        "Conflito: artista já tem evento publicado que sobrepõe este intervalo",
      );
    }
    if (
      input.venueId &&
      (await this.hasVenueConflict(input.venueId, input.startsAt, input.endsAt))
    ) {
      throw new BadRequestException("Conflito: venue já tem evento publicado neste intervalo");
    }
    const artistBlocks = await this.artistUnavail
      .createQueryBuilder("u")
      .where("u.artistId = :id", { id: input.organizerArtistId })
      .andWhere("u.startsAt < :to AND u.endsAt > :from", {
        from: input.startsAt,
        to: input.endsAt,
      })
      .getCount();
    if (artistBlocks > 0) {
      throw new BadRequestException("Artista marcado como indisponível neste intervalo");
    }
    if (input.venueId) {
      const venueBlocks = await this.venueUnavail
        .createQueryBuilder("u")
        .where("u.venueId = :id", { id: input.venueId })
        .andWhere("u.startsAt < :to AND u.endsAt > :from", {
          from: input.startsAt,
          to: input.endsAt,
        })
        .getCount();
      if (venueBlocks > 0) {
        throw new BadRequestException("Venue marcado como indisponível neste intervalo");
      }
    }
  }

  async suggestFreeSlots(
    artistId: string,
    query: SuggestSlotsQuery,
  ): Promise<Array<{ startsAt: string; endsAt: string }>> {
    const { from, to } = this.parseRange({ fromIso: query.fromIso, toIso: query.toIso });
    const durationMs = (query.durationMinutes ?? 60) * 60_000;
    const stepMs = (query.stepMinutes ?? 30) * 60_000;
    if (durationMs < 15 * 60_000) throw new BadRequestException("Duração mínima 15 minutos");
    if (stepMs < 5 * 60_000) throw new BadRequestException("Passo mínimo 5 minutos");

    const externalBusy =
      query.externalCalendarOwnerRef?.trim() && this.externalCalendar
        ? await this.externalCalendar.listBusyWindows({
            ownerExternalRef: query.externalCalendarOwnerRef.trim(),
            from,
            to,
          })
        : [];

    const out: Array<{ startsAt: string; endsAt: string }> = [];
    for (let t = from.getTime(); t + durationMs <= to.getTime(); t += stepMs) {
      const startsAt = new Date(t);
      const endsAt = new Date(t + durationMs);
      if (
        await this.isIntervalFreeForSuggestion(artistId, query.venueId ?? null, startsAt, endsAt, externalBusy)
      ) {
        out.push({ startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString() });
        if (out.length >= MAX_SUGGESTED_SLOTS) break;
      }
    }
    return out;
  }

  private overlapsExternal(
    startsAt: Date,
    endsAt: Date,
    busy: Array<{ start: Date; end: Date }>,
  ): boolean {
    return busy.some((b) => b.start < endsAt && b.end > startsAt);
  }

  private async isIntervalFreeForSuggestion(
    artistId: string,
    venueId: string | null,
    startsAt: Date,
    endsAt: Date,
    externalBusy: Array<{ start: Date; end: Date }>,
  ): Promise<boolean> {
    if (await this.hasArtistConflict(artistId, startsAt, endsAt)) return false;
    if (venueId && (await this.hasVenueConflict(venueId, startsAt, endsAt))) return false;
    if (this.overlapsExternal(startsAt, endsAt, externalBusy)) return false;

    const artistBlocks = await this.artistUnavail
      .createQueryBuilder("u")
      .where("u.artistId = :id", { id: artistId })
      .andWhere("u.startsAt < :to AND u.endsAt > :from", { from: startsAt, to: endsAt })
      .getCount();
    if (artistBlocks > 0) return false;

    if (venueId) {
      const venueBlocks = await this.venueUnavail
        .createQueryBuilder("u")
        .where("u.venueId = :id", { id: venueId })
        .andWhere("u.startsAt < :to AND u.endsAt > :from", { from: startsAt, to: endsAt })
        .getCount();
      if (venueBlocks > 0) return false;
    }
    return true;
  }

  async addArtistUnavailability(
    artistId: string,
    startsAt: Date,
    endsAt: Date,
    reason?: string | null,
  ): Promise<{ id: string }> {
    if (endsAt <= startsAt) throw new BadRequestException("endsAt deve ser após startsAt");
    const row = new ArtistUnavailabilityOrmEntity();
    row.id = randomUUID();
    row.artistId = artistId;
    row.startsAt = startsAt;
    row.endsAt = endsAt;
    row.reason = reason?.trim() ?? null;
    await this.artistUnavail.save(row);
    return { id: row.id };
  }

  async addVenueUnavailability(
    venueId: string,
    startsAt: Date,
    endsAt: Date,
    reason?: string | null,
  ): Promise<{ id: string }> {
    if (endsAt <= startsAt) throw new BadRequestException("endsAt deve ser após startsAt");
    const row = new VenueUnavailabilityOrmEntity();
    row.id = randomUUID();
    row.venueId = venueId;
    row.startsAt = startsAt;
    row.endsAt = endsAt;
    row.reason = reason?.trim() ?? null;
    await this.venueUnavail.save(row);
    return { id: row.id };
  }
}
