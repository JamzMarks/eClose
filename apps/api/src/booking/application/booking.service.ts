import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookingInquiryOrmEntity } from "@/booking/infrastructure/persistence/booking-inquiry.orm-entity";
import { IArtistRepository } from "@/artist/interfaces/artist.repository.interface";
import { ARTIST_REPOSITORY } from "@/artist/tokens/artist.tokens";
import { ICalendarService } from "@/calendar/interfaces/calendar.service.interface";
import { CALENDAR_SERVICE } from "@/calendar/tokens/calendar.tokens";
import { IChatService } from "@/chat/interfaces/chat.service.interface";
import { CHAT_SERVICE } from "@/chat/tokens/chat.tokens";
import { ChatEntityType } from "@/chat/types/chat-entity-type.type";
import { CreateEventDto } from "@/event/dto/create-event.dto";
import { IEventService } from "@/event/interfaces/event.service.interface";
import { EVENT_SERVICE } from "@/event/tokens/event.tokens";
import { EventLocationMode } from "@/event/types/event-location-mode.type";
import { EventStatus } from "@/event/types/event-status.type";
import { INotificationService } from "@/notification/interfaces/notification.interface";
import { NOTIFICATION_SERVICE } from "@/notification/tokens/notification.tokens";
import { DomainEventName } from "@/notification/types/domain-event-names";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { IVenueRepository } from "@/venue/interfaces/venue.repository.interface";
import { VENUE_REPOSITORY } from "@/venue/tokens/venue.tokens";
import { BookingInquiryStatus } from "@/booking/types/booking-inquiry-status.type";
import { ConfirmBookingDatesDto } from "@/booking/dto/confirm-booking-dates.dto";
import { CreateBookingInquiryDto } from "@/booking/dto/create-booking-inquiry.dto";
import { CreateEventFromBookingDto } from "@/booking/dto/create-event-from-booking.dto";
import { DeclineBookingDto } from "@/booking/dto/decline-booking.dto";
import { ProposeBookingDatesDto } from "@/booking/dto/propose-booking-dates.dto";
import { IBookingService } from "@/booking/interfaces/booking.service.interface";

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @InjectRepository(BookingInquiryOrmEntity)
    private readonly inquiries: Repository<BookingInquiryOrmEntity>,
    @Inject(CHAT_SERVICE)
    private readonly chat: IChatService,
    @Inject(ARTIST_REPOSITORY)
    private readonly artists: IArtistRepository,
    @Inject(VENUE_REPOSITORY)
    private readonly venues: IVenueRepository,
    @Inject(CALENDAR_SERVICE)
    private readonly calendar: ICalendarService,
    @Inject(EVENT_SERVICE)
    private readonly events: IEventService,
    @Optional()
    @Inject(NOTIFICATION_SERVICE)
    private readonly notifications?: INotificationService,
  ) {}

  private async emit(name: string, aggregateId: string, payload?: Record<string, unknown>) {
    if (!this.notifications) return;
    await this.notifications.handleEvent({
      name,
      aggregateId,
      occurredAt: new Date(),
      payload,
    });
  }

  private counterpartChatRef(row: BookingInquiryOrmEntity): {
    entityType: ChatEntityType;
    entityId: string;
  } {
    if (row.artistId) {
      return { entityType: ChatEntityType.ARTIST, entityId: row.artistId };
    }
    if (row.venueId) {
      return { entityType: ChatEntityType.VENUE, entityId: row.venueId };
    }
    throw new BadRequestException("Inquiry sem contraparte");
  }

  async createInquiry(requesterUserId: string, dto: CreateBookingInquiryDto) {
    if (!dto.artistId && !dto.venueId) {
      throw new BadRequestException("Informe artistId ou venueId");
    }
    if (dto.artistId && dto.venueId) {
      throw new BadRequestException("Envie apenas artistId ou venueId");
    }

    if (dto.artistId) {
      const artist = await this.artists.findById(dto.artistId);
      if (!artist) throw new NotFoundException("Artista não encontrado");
      if (!artist.openToVenueBookings) {
        throw new BadRequestException("Artista não aceita abordagens de booking");
      }
      const userRef = { entityType: ChatEntityType.USER, entityId: requesterUserId };
      const artistRef = { entityType: ChatEntityType.ARTIST, entityId: dto.artistId };
      const conversation = await this.chat.getOrCreateDirectConversation(userRef, artistRef);
      const row = new BookingInquiryOrmEntity();
      row.id = this.ids.generate();
      row.conversationId = conversation.id;
      row.requesterUserId = requesterUserId;
      row.artistId = dto.artistId;
      row.venueId = null;
      row.requesterOrganizerArtistId = null;
      row.status = BookingInquiryStatus.OPEN;
      row.notes = dto.notes?.trim() ?? null;
      row.linkedEventId = null;
      await this.inquiries.save(row);
      const body = dto.notes?.trim()
        ? `Pedido de booking: ${dto.notes.trim()}`
        : "Pedido de booking iniciado.";
      await this.chat.sendMessage(conversation.id, userRef, body);
      await this.emit(DomainEventName.BOOKING_INQUIRY_CREATED, row.id, {
        notifyUserId: artist.ownerId,
        requesterUserId,
      });
      return row;
    }

    const venue = await this.venues.findById(dto.venueId!);
    if (!venue) throw new NotFoundException("Venue não encontrado");
    if (!venue.openToArtistInquiries) {
      throw new BadRequestException("Venue não aceita consultas de artistas");
    }
    const organizerArtistId = dto.organizerArtistId!;
    const organizerArtist = await this.artists.findById(organizerArtistId);
    if (!organizerArtist) throw new NotFoundException("Artista organizador não encontrado");
    if (organizerArtist.ownerId !== requesterUserId) {
      throw new ForbiddenException("organizerArtistId deve ser um artista do solicitante");
    }
    const userRef = { entityType: ChatEntityType.USER, entityId: requesterUserId };
    const venueRef = { entityType: ChatEntityType.VENUE, entityId: dto.venueId! };
    const conversation = await this.chat.getOrCreateDirectConversation(userRef, venueRef);
    const row = new BookingInquiryOrmEntity();
    row.id = this.ids.generate();
    row.conversationId = conversation.id;
    row.requesterUserId = requesterUserId;
    row.artistId = null;
    row.venueId = dto.venueId!;
    row.requesterOrganizerArtistId = organizerArtistId;
    row.status = BookingInquiryStatus.OPEN;
    row.notes = dto.notes?.trim() ?? null;
    row.linkedEventId = null;
    await this.inquiries.save(row);
    const body = dto.notes?.trim()
      ? `Pedido de booking: ${dto.notes.trim()}`
      : "Pedido de booking iniciado.";
    await this.chat.sendMessage(conversation.id, userRef, body);
    await this.emit(DomainEventName.BOOKING_INQUIRY_CREATED, row.id, {
      notifyUserId: venue.ownerUserId ?? undefined,
      requesterUserId,
    });
    return row;
  }

  async proposeDates(inquiryId: string, actorUserId: string, dto: ProposeBookingDatesDto) {
    const row = await this.inquiries.findOne({ where: { id: inquiryId } });
    if (!row) throw new NotFoundException("Inquiry não encontrada");
    if (
      row.status !== BookingInquiryStatus.OPEN &&
      row.status !== BookingInquiryStatus.NEGOTIATING
    ) {
      throw new BadRequestException("Proposta de datas não permitida neste estado");
    }
    const startsAt = new Date(dto.proposedStartsAt);
    const endsAt = new Date(dto.proposedEndsAt);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      throw new BadRequestException("Datas inválidas");
    }
    row.proposedStartsAt = startsAt;
    row.proposedEndsAt = endsAt;
    row.status = BookingInquiryStatus.NEGOTIATING;
    await this.inquiries.save(row);
    const ref = this.counterpartChatRef(row);
    await this.chat.sendMessage(
      row.conversationId,
      ref,
      `Contraparte propôs datas: ${dto.proposedStartsAt} → ${dto.proposedEndsAt}`,
    );
    await this.emit(DomainEventName.BOOKING_DATES_PROPOSED, row.id, {
      notifyUserId: row.requesterUserId,
    });
    return row;
  }

  async confirmDates(inquiryId: string, requesterUserId: string, dto: ConfirmBookingDatesDto) {
    const row = await this.inquiries.findOne({ where: { id: inquiryId } });
    if (!row) throw new NotFoundException("Inquiry não encontrada");
    if (row.requesterUserId !== requesterUserId) {
      throw new BadRequestException("Apenas o solicitante pode confirmar datas neste fluxo");
    }
    if (
      row.status !== BookingInquiryStatus.OPEN &&
      row.status !== BookingInquiryStatus.NEGOTIATING
    ) {
      throw new BadRequestException("Confirmação de datas não permitida neste estado");
    }
    const startsAt = new Date(dto.proposedStartsAt);
    const endsAt = new Date(dto.proposedEndsAt);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      throw new BadRequestException("Datas inválidas");
    }
    const organizerArtistId = row.artistId ?? row.requesterOrganizerArtistId;
    if (!organizerArtistId) {
      throw new BadRequestException(
        "Confirmação com calendário requer artista organizador na inquiry (pedidos a venue: organizerArtistId na criação)",
      );
    }
    await this.calendar.validateNoConflictForPublish({
      organizerArtistId,
      venueId: row.venueId,
      startsAt,
      endsAt,
    });
    row.proposedStartsAt = startsAt;
    row.proposedEndsAt = endsAt;
    row.status = BookingInquiryStatus.DATES_CONFIRMED;
    await this.inquiries.save(row);
    await this.chat.sendMessage(
      row.conversationId,
      { entityType: ChatEntityType.USER, entityId: requesterUserId },
      `Datas propostas confirmadas no calendário: ${dto.proposedStartsAt} → ${dto.proposedEndsAt}`,
    );
    const counterpartId = await this.resolveCounterpartUserId(row);
    await this.emit(DomainEventName.BOOKING_DATES_CONFIRMED, row.id, {
      notifyUserId: counterpartId ?? undefined,
    });
    return row;
  }

  async acceptBooking(inquiryId: string, _actorUserId: string) {
    const row = await this.inquiries.findOne({ where: { id: inquiryId } });
    if (!row) throw new NotFoundException("Inquiry não encontrada");
    if (row.status !== BookingInquiryStatus.DATES_CONFIRMED) {
      throw new BadRequestException("Aceite só é possível após datas confirmadas pelo solicitante");
    }
    row.status = BookingInquiryStatus.CONFIRMED;
    await this.inquiries.save(row);
    const ref = this.counterpartChatRef(row);
    await this.chat.sendMessage(row.conversationId, ref, "Booking confirmado pela contraparte.");
    await this.emit(DomainEventName.BOOKING_CONFIRMED, row.id, {
      notifyUserId: row.requesterUserId,
    });
    return row;
  }

  async declineBooking(inquiryId: string, _actorUserId: string, dto?: DeclineBookingDto) {
    const row = await this.inquiries.findOne({ where: { id: inquiryId } });
    if (!row) throw new NotFoundException("Inquiry não encontrada");
    if (
      row.status === BookingInquiryStatus.CONFIRMED ||
      row.status === BookingInquiryStatus.CANCELLED
    ) {
      throw new BadRequestException("Inquiry já encerrada");
    }
    row.status = BookingInquiryStatus.CANCELLED;
    await this.inquiries.save(row);
    const ref = this.counterpartChatRef(row);
    const reason = dto?.reason?.trim();
    await this.chat.sendMessage(
      row.conversationId,
      ref,
      reason ? `Pedido recusado: ${reason}` : "Pedido recusado pela contraparte.",
    );
    await this.emit(DomainEventName.BOOKING_DECLINED, row.id, {
      notifyUserId: row.requesterUserId,
    });
    return row;
  }

  async cancelByRequester(inquiryId: string, requesterUserId: string) {
    const row = await this.inquiries.findOne({ where: { id: inquiryId } });
    if (!row) throw new NotFoundException("Inquiry não encontrada");
    if (row.requesterUserId !== requesterUserId) {
      throw new BadRequestException("Apenas o solicitante pode cancelar");
    }
    if (
      row.status === BookingInquiryStatus.CONFIRMED ||
      row.status === BookingInquiryStatus.CANCELLED
    ) {
      throw new BadRequestException("Inquiry já encerrada");
    }
    row.status = BookingInquiryStatus.CANCELLED;
    await this.inquiries.save(row);
    await this.chat.sendMessage(
      row.conversationId,
      { entityType: ChatEntityType.USER, entityId: requesterUserId },
      "Pedido cancelado pelo solicitante.",
    );
    const counterpartId = await this.resolveCounterpartUserId(row);
    await this.emit(DomainEventName.BOOKING_CANCELLED, row.id, {
      notifyUserId: counterpartId ?? undefined,
    });
    return row;
  }

  async createEventFromBooking(
    inquiryId: string,
    actorUserId: string,
    dto: CreateEventFromBookingDto,
  ) {
    const row = await this.inquiries.findOne({ where: { id: inquiryId } });
    if (!row) throw new NotFoundException("Inquiry não encontrada");
    if (row.status !== BookingInquiryStatus.CONFIRMED) {
      throw new BadRequestException("Crie evento apenas após booking confirmado");
    }
    const organizerArtistId = row.artistId ?? row.requesterOrganizerArtistId;
    if (!organizerArtistId) {
      throw new BadRequestException("Evento exige artista organizador na inquiry");
    }
    const organizerArtist = await this.artists.findById(organizerArtistId);
    if (!organizerArtist) throw new NotFoundException("Artista organizador não encontrado");

    if (row.artistId) {
      if (organizerArtist.ownerId !== actorUserId) {
        throw new ForbiddenException("Apenas o dono do artista (contraparte) pode criar o evento");
      }
    } else if (row.venueId) {
      const venue = await this.venues.findById(row.venueId);
      if (!venue || venue.ownerUserId !== actorUserId) {
        throw new ForbiddenException("Apenas o dono do venue pode criar o evento deste booking");
      }
    } else {
      throw new BadRequestException("Inquiry sem contraparte válida");
    }
    if (row.linkedEventId) {
      throw new BadRequestException("Já existe evento associado a este booking");
    }
    const startsAt = dto.startsAt
      ? new Date(dto.startsAt)
      : row.proposedStartsAt
        ? new Date(row.proposedStartsAt)
        : null;
    const endsAt = dto.endsAt
      ? new Date(dto.endsAt)
      : row.proposedEndsAt
        ? new Date(row.proposedEndsAt)
        : null;
    if (!startsAt || !endsAt || Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      throw new BadRequestException("Datas do evento inválidas ou ausentes no booking");
    }
    const createDto: CreateEventDto = {
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      locationMode: dto.locationMode,
      venueId: dto.venueId ?? row.venueId ?? undefined,
      onlineUrl: dto.onlineUrl,
      locationLabel: dto.locationLabel,
      locationNotes: dto.locationNotes,
      adhocAddress: dto.adhocAddress,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      timezone: dto.timezone,
      organizerArtistId,
      taxonomyTermIds: dto.taxonomyTermIds,
      status: dto.status ?? EventStatus.DRAFT,
    };
    if (
      createDto.locationMode === EventLocationMode.ONLINE &&
      !createDto.onlineUrl?.trim()
    ) {
      throw new BadRequestException("Evento online exige onlineUrl");
    }
    const event = await this.events.create(createDto as CreateEventDto);
    row.linkedEventId = event.id;
    await this.inquiries.save(row);
    await this.chat.sendMessage(
      row.conversationId,
      { entityType: ChatEntityType.ARTIST, entityId: organizerArtistId },
      `Evento criado a partir do booking: ${event.slug}`,
    );
    return { inquiry: row, event };
  }

  private async resolveCounterpartUserId(row: BookingInquiryOrmEntity): Promise<string | null> {
    if (row.artistId) {
      const a = await this.artists.findById(row.artistId);
      return a?.ownerId ?? null;
    }
    if (row.venueId) {
      const v = await this.venues.findById(row.venueId);
      return v?.ownerUserId ?? null;
    }
    return null;
  }
}
