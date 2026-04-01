import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
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
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { IVenueRepository } from "@/venue/interfaces/venue.repository.interface";
import { VENUE_REPOSITORY } from "@/venue/tokens/venue.tokens";
import { ConfirmBookingDatesDto } from "./dto/confirm-booking-dates.dto";
import { CreateBookingInquiryDto } from "./dto/create-booking-inquiry.dto";

@Injectable()
export class BookingService {
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
  ) {}

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
      row.status = "OPEN";
      row.notes = dto.notes?.trim() ?? null;
      await this.inquiries.save(row);
      const body = dto.notes?.trim()
        ? `Pedido de booking: ${dto.notes.trim()}`
        : "Pedido de booking iniciado.";
      await this.chat.sendMessage(conversation.id, userRef, body);
      return row;
    }

    const venue = await this.venues.findById(dto.venueId!);
    if (!venue) throw new NotFoundException("Venue não encontrado");
    if (!venue.openToArtistInquiries) {
      throw new BadRequestException("Venue não aceita consultas de artistas");
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
    row.status = "OPEN";
    row.notes = dto.notes?.trim() ?? null;
    await this.inquiries.save(row);
    const body = dto.notes?.trim()
      ? `Pedido de booking: ${dto.notes.trim()}`
      : "Pedido de booking iniciado.";
    await this.chat.sendMessage(conversation.id, userRef, body);
    return row;
  }

  async confirmDates(inquiryId: string, requesterUserId: string, dto: ConfirmBookingDatesDto) {
    const row = await this.inquiries.findOne({ where: { id: inquiryId } });
    if (!row) throw new NotFoundException("Inquiry não encontrada");
    if (row.requesterUserId !== requesterUserId) {
      throw new BadRequestException("Apenas o solicitante pode confirmar datas neste fluxo");
    }
    const startsAt = new Date(dto.proposedStartsAt);
    const endsAt = new Date(dto.proposedEndsAt);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      throw new BadRequestException("Datas inválidas");
    }
    if (!row.artistId) {
      throw new BadRequestException("Confirmação com calendário requer inquiry com artista organizador");
    }
    await this.calendar.validateNoConflictForPublish({
      organizerArtistId: row.artistId,
      venueId: row.venueId,
      startsAt,
      endsAt,
    });
    row.proposedStartsAt = startsAt;
    row.proposedEndsAt = endsAt;
    row.status = "DATES_CONFIRMED";
    await this.inquiries.save(row);
    await this.chat.sendMessage(
      row.conversationId,
      { entityType: ChatEntityType.USER, entityId: requesterUserId },
      `Datas propostas confirmadas no calendário: ${dto.proposedStartsAt} → ${dto.proposedEndsAt}`,
    );
    return row;
  }
}
