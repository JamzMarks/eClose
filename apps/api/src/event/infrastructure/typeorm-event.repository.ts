import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventOrmEntity } from "@/event/infrastructure/persistence/event.orm-entity";
import { VenueOrmEntity } from "@/venue/infrastructure/persistence/venue.orm-entity";
import { Event } from "@/event/domain/entity/event.entity";
import {
  IEventRepository,
  ListPublishedEventsParams,
} from "@/event/application/ports/event.repository.interface";
import { EventAdhocAddress } from "@/event/domain/types/event-adhoc-address.type";
import { EventLocationMode } from "@/event/domain/types/event-location-mode.type";
import { EventStatus } from "@/event/domain/types/event-status.type";

@Injectable()
export class TypeormEventRepository implements IEventRepository {
  constructor(
    @InjectRepository(EventOrmEntity)
    private readonly repo: Repository<EventOrmEntity>,
  ) {}

  async save(e: Event): Promise<void> {
    await this.repo.save(this.toRow(e));
  }

  async findById(id: string): Promise<Event | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Event | null> {
    const s = slug.trim().toLowerCase();
    const row = await this.repo.findOne({ where: { slug: s } });
    return row ? this.toDomain(row) : null;
  }

  async listByArtistInRange(
    artistId: string,
    from: Date,
    to: Date,
    statuses: EventStatus[] = [EventStatus.PUBLISHED],
  ): Promise<Event[]> {
    const rows = await this.repo
      .createQueryBuilder("e")
      .where("e.organizerArtistId = :artistId", { artistId })
      .andWhere("e.status IN (:...statuses)", { statuses })
      .andWhere("e.startsAt < :to AND e.endsAt > :from", { from, to })
      .getMany();
    return rows.map((r) => this.toDomain(r));
  }

  async listByVenueInRange(
    venueId: string,
    from: Date,
    to: Date,
    statuses: EventStatus[] = [EventStatus.PUBLISHED],
  ): Promise<Event[]> {
    const rows = await this.repo
      .createQueryBuilder("e")
      .where("e.venueId = :venueId", { venueId })
      .andWhere("e.status IN (:...statuses)", { statuses })
      .andWhere("e.startsAt < :to AND e.endsAt > :from", { from, to })
      .getMany();
    return rows.map((r) => this.toDomain(r));
  }

  async listPublishedFiltered(
    params: ListPublishedEventsParams,
  ): Promise<{ items: Event[]; total: number }> {
    let qb = this.repo
      .createQueryBuilder("e")
      .where("e.status = :pub", { pub: EventStatus.PUBLISHED });

    if (params.q?.trim()) {
      qb = qb.andWhere("LOWER(e.title) LIKE :q", {
        q: `%${params.q.trim().toLowerCase()}%`,
      });
    }
    if (params.venueId) {
      qb = qb.andWhere("e.venueId = :vid", { vid: params.venueId });
    }
    if (params.from && params.to) {
      qb = qb.andWhere("e.startsAt < :to AND e.endsAt > :from", {
        from: params.from,
        to: params.to,
      });
    } else if (params.from) {
      qb = qb.andWhere("e.endsAt > :from", { from: params.from });
    } else if (params.to) {
      qb = qb.andWhere("e.startsAt < :to", { to: params.to });
    }
    if (params.taxonomyTermIds?.length) {
      qb = qb.andWhere("e.taxonomyTermIds::jsonb ?| ARRAY[:...tids]::text[]", {
        tids: params.taxonomyTermIds,
      });
    }
    if (params.city?.trim()) {
      qb = qb.innerJoin(VenueOrmEntity, "v", "v.id = e.venueId").andWhere(
        "LOWER((v.address)::jsonb ->> 'city') LIKE :city",
        { city: `%${params.city.trim().toLowerCase()}%` },
      );
    }

    const total = await qb.clone().getCount();
    const sortCol =
      params.sortBy === "title"
        ? "e.title"
        : params.sortBy === "createdAt"
          ? "e.createdAt"
          : "e.startsAt";
    const rows = await qb
      .orderBy(sortCol, params.order)
      .skip(params.offset)
      .take(params.limit)
      .getMany();

    return { items: rows.map((r) => this.toDomain(r)), total };
  }

  private toRow(ev: Event): EventOrmEntity {
    const row = new EventOrmEntity();
    row.id = ev.id;
    row.title = ev.title;
    row.slug = ev.slug;
    row.description = ev.description;
    row.locationMode = ev.locationMode;
    row.venueId = ev.venueId;
    row.onlineUrl = ev.onlineUrl;
    row.locationLabel = ev.locationLabel;
    row.locationNotes = ev.locationNotes;
    row.adhocAddress = ev.adhocAddress ? { ...ev.adhocAddress } : null;
    row.startsAt = ev.startsAt;
    row.endsAt = ev.endsAt;
    row.timezone = ev.timezone;
    row.organizerArtistId = ev.organizerArtistId;
    row.taxonomyTermIds = [...ev.taxonomyTermIds];
    row.primaryMediaAssetId = ev.primaryMediaAssetId;
    row.status = ev.status;
    row.createdAt = ev.createdAt;
    row.updatedAt = ev.updatedAt;
    return row;
  }

  private toDomain(row: EventOrmEntity): Event {
    return Event.hydrate({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      locationMode: row.locationMode as EventLocationMode,
      venueId: row.venueId,
      onlineUrl: row.onlineUrl,
      locationLabel: row.locationLabel,
      locationNotes: row.locationNotes,
      adhocAddress: row.adhocAddress as EventAdhocAddress | null,
      startsAt: row.startsAt,
      endsAt: row.endsAt,
      timezone: row.timezone,
      organizerArtistId: row.organizerArtistId,
      taxonomyTermIds: [...(row.taxonomyTermIds ?? [])],
      primaryMediaAssetId: row.primaryMediaAssetId,
      status: row.status as EventStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
