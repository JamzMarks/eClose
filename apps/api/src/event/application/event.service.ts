import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { ITaxonomyService } from "@/taxonomy/interfaces/taxonomy.service.interface";
import { TAXONOMY_SERVICE } from "@/taxonomy/tokens/taxonomy.tokens";
import { TaxonomyKind } from "@/taxonomy/types/taxonomy-kind.type";
import { IVenueRepository } from "@/venue/application/ports/venue.repository.interface";
import { VENUE_REPOSITORY } from "@/venue/application/tokens/venue.tokens";
import { ICalendarService } from "@/calendar/interfaces/calendar.service.interface";
import { CALENDAR_SERVICE } from "@/calendar/tokens/calendar.tokens";
import { IArtistRepository } from "@/artist/interfaces/artist.repository.interface";
import { ARTIST_REPOSITORY } from "@/artist/tokens/artist.tokens";
import { Event } from "@/event/domain/entity/event.entity";
import { IEventMediaPort } from "@/event/application/ports/event-media.port.interface";
import { EVENT_MEDIA_PORT } from "@/event/application/tokens/event-media.tokens";
import { CreateEventDto } from "@/event/interface/http/dto/create-event.dto";
import { EventAdhocAddress } from "@/event/domain/types/event-adhoc-address.type";
import { IEventRepository, ListPublishedEventsParams } from "@/event/application/ports/event.repository.interface";
import {
  IEventService,
  PublicEventWithPrimaryUrl,
} from "@/event/application/ports/event.service.interface";
import { EVENT_REPOSITORY } from "@/event/application/tokens/event.tokens";
import { IMediaService } from "@/media/interfaces/media.service.interface";
import { MEDIA_SERVICE } from "@/media/tokens/media.tokens";
import { MediaParentType } from "@/media/types/media-parent-type.type";
import { EventLocationMode } from "@/event/domain/types/event-location-mode.type";
import { EventStatus } from "@/event/domain/types/event-status.type";

@Injectable()
export class EventService implements IEventService {
  constructor(
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @Inject(EVENT_REPOSITORY) private readonly events: IEventRepository,
    @Inject(VENUE_REPOSITORY) private readonly venues: IVenueRepository,
    @Inject(TAXONOMY_SERVICE) private readonly taxonomy: ITaxonomyService,
    @Inject(EVENT_MEDIA_PORT) private readonly eventMedia: IEventMediaPort,
    @Inject(CALENDAR_SERVICE) private readonly calendar: ICalendarService,
    @Inject(ARTIST_REPOSITORY) private readonly artists: IArtistRepository,
    @Inject(MEDIA_SERVICE) private readonly media: IMediaService,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const slugTaken = await this.events.findBySlug(dto.slug);
    if (slugTaken) throw new ConflictException("Slug de evento já em uso");

    if (dto.locationMode === EventLocationMode.ONLINE && dto.venueId) {
      throw new BadRequestException("Evento online não deve incluir venueId");
    }

    if (dto.locationMode === EventLocationMode.ONLINE && !dto.onlineUrl?.trim()) {
      throw new BadRequestException("Evento online exige onlineUrl");
    }
    if (dto.locationMode === EventLocationMode.HYBRID && !dto.onlineUrl?.trim()) {
      throw new BadRequestException("Evento híbrido exige onlineUrl");
    }

    const status = dto.status ?? EventStatus.DRAFT;
    if (
      status === EventStatus.PUBLISHED &&
      dto.locationMode === EventLocationMode.PHYSICAL &&
      !dto.venueId
    ) {
      const hasInformal =
        dto.locationLabel?.trim() ||
        dto.locationNotes?.trim() ||
        dto.description?.trim() ||
        dto.adhocAddress?.line1?.trim() ||
        dto.adhocAddress?.city?.trim();
      if (!hasInformal) {
        throw new BadRequestException(
          "Evento presencial publicado sem venue precisa de local informal: locationLabel, locationNotes, descrição ou adhocAddress",
        );
      }
    }

    if (
      (dto.locationMode === EventLocationMode.PHYSICAL ||
        dto.locationMode === EventLocationMode.HYBRID) &&
      dto.venueId
    ) {
      const venue = await this.venues.findById(dto.venueId);
      if (!venue) throw new NotFoundException("Venue não encontrado");
      if (!venue.isActive) throw new BadRequestException("Venue inativo");
    }

    const termIds = dto.taxonomyTermIds ?? [];
    await this.taxonomy.assertTermsValid(termIds, [
      TaxonomyKind.EVENT_TYPE,
      TaxonomyKind.INTEREST,
      TaxonomyKind.GENRE,
    ]);

    const organizer = await this.artists.findById(dto.organizerArtistId);
    if (!organizer) throw new NotFoundException("Artista organizador não encontrado");
    if (!organizer.isActive) throw new BadRequestException("Artista organizador inativo");

    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      throw new BadRequestException("Datas inválidas");
    }

    if (status === EventStatus.PUBLISHED) {
      await this.calendar.validateNoConflictForPublish({
        organizerArtistId: dto.organizerArtistId,
        venueId: dto.venueId ?? null,
        startsAt,
        endsAt,
      });
    }

    let event: Event;
    try {
      event = Event.create({
        id: this.ids.generate(),
        title: dto.title,
        slug: dto.slug,
        description: dto.description ?? null,
        locationMode: dto.locationMode,
        venueId: dto.venueId ?? null,
        onlineUrl: dto.onlineUrl ?? null,
        locationLabel: dto.locationLabel ?? null,
        locationNotes: dto.locationNotes ?? null,
        adhocAddress: EventService.mapAdhocAddress(dto),
        startsAt,
        endsAt,
        timezone: dto.timezone,
        organizerArtistId: dto.organizerArtistId,
        taxonomyTermIds: termIds,
        primaryMediaAssetId: null,
        status: dto.status,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Dados do evento inválidos";
      throw new BadRequestException(msg);
    }

    await this.events.save(event);
    return event;
  }

  async getById(id: string): Promise<Event | null> {
    return this.events.findById(id);
  }

  async getPublicById(id: string): Promise<PublicEventWithPrimaryUrl | null> {
    const e = await this.events.findById(id);
    if (!e || e.status !== EventStatus.PUBLISHED) return null;
    const primaries = await this.media.getPrimaryMany(MediaParentType.EVENT, [e.id]);
    return {
      ...e,
      primaryMediaUrl: primaries.get(e.id)?.sourceUrl ?? null,
    };
  }

  async listPublishedPublic(
    params: Omit<ListPublishedEventsParams, "limit" | "offset" | "sortBy" | "order"> & {
      page?: number;
      limit?: number;
      sortBy?: ListPublishedEventsParams["sortBy"];
      order?: ListPublishedEventsParams["order"];
    },
  ): Promise<{
    items: PublicEventWithPrimaryUrl[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (params.from && Number.isNaN(params.from.getTime())) {
      throw new BadRequestException("Parâmetro from inválido");
    }
    if (params.to && Number.isNaN(params.to.getTime())) {
      throw new BadRequestException("Parâmetro to inválido");
    }
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const offset = (page - 1) * limit;
    const sortBy = params.sortBy ?? "startsAt";
    const order = params.order ?? "ASC";
    const { items, total } = await this.events.listPublishedFiltered({
      from: params.from,
      to: params.to,
      taxonomyTermIds: params.taxonomyTermIds,
      venueId: params.venueId,
      city: params.city,
      q: params.q,
      limit,
      offset,
      sortBy,
      order,
    });
    const primaries = await this.media.getPrimaryMany(
      MediaParentType.EVENT,
      items.map((ev) => ev.id),
    );
    const withUrls: PublicEventWithPrimaryUrl[] = items.map((ev) => ({
      ...ev,
      primaryMediaUrl: primaries.get(ev.id)?.sourceUrl ?? null,
    }));
    return { items: withUrls, total, page, limit };
  }

  async linkPrimaryMedia(eventId: string, mediaAssetId: string): Promise<Event> {
    const event = await this.events.findById(eventId);
    if (!event) throw new NotFoundException("Evento não encontrado");

    await this.eventMedia.assertAndSetPrimary(eventId, mediaAssetId);

    event.setPrimaryMediaAssetId(mediaAssetId);
    await this.events.save(event);
    return event;
  }

  private static mapAdhocAddress(dto: CreateEventDto): EventAdhocAddress | null {
    const a = dto.adhocAddress;
    if (!a) return null;
    return {
      line1: a.line1 ?? null,
      line2: a.line2 ?? null,
      city: a.city ?? null,
      region: a.region ?? null,
      countryCode: a.countryCode ?? null,
      postalCode: a.postalCode ?? null,
      geoLat: a.geoLat ?? null,
      geoLng: a.geoLng ?? null,
      externalPlaceRef: a.externalPlaceRef ?? null,
    };
  }
}
