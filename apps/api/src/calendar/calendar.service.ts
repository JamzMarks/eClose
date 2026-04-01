import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { ArtistUnavailabilityOrmEntity } from "@/calendar/infrastructure/persistence/artist-unavailability.orm-entity";
import { VenueUnavailabilityOrmEntity } from "@/calendar/infrastructure/persistence/venue-unavailability.orm-entity";
import { Event } from "@/event/entity/event.entity";
import { IEventRepository } from "@/event/interfaces/event.repository.interface";
import { EVENT_REPOSITORY } from "@/event/tokens/event.tokens";
import { EventStatus } from "@/event/types/event-status.type";
import {
  CalendarRangeQuery,
  ICalendarService,
  PublishWindowInput,
} from "./interfaces/calendar.service.interface";

@Injectable()
export class CalendarService implements ICalendarService {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly events: IEventRepository,
    @InjectRepository(ArtistUnavailabilityOrmEntity)
    private readonly artistUnavail: Repository<ArtistUnavailabilityOrmEntity>,
    @InjectRepository(VenueUnavailabilityOrmEntity)
    private readonly venueUnavail: Repository<VenueUnavailabilityOrmEntity>,
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
