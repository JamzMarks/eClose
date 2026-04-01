import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AccessDeniedError } from "@/domain/errors/access-denied.error";
import { ResourceNotFoundError } from "@/domain/errors/resource-not-found.error";
import { ArtistAccessPolicyPort } from "@/artist/application/ports/artist-access.policy.port";
import { ARTIST_ACCESS_POLICY } from "@/artist/application/ports/artist-access.policy.port";
import { VenueAccessPolicyPort } from "@/venue/application/ports/venue-access.policy.port";
import { VENUE_ACCESS_POLICY } from "@/venue/application/ports/venue-access.policy.port";
import { BookingInquiryOrmEntity } from "@/booking/infrastructure/persistence/booking-inquiry.orm-entity";
import { BookingAccessPolicyPort } from "@/booking/application/ports/booking-access.policy.port";

@Injectable()
export class BookingAccessPolicyImpl implements BookingAccessPolicyPort {
  constructor(
    @InjectRepository(BookingInquiryOrmEntity)
    private readonly inquiries: Repository<BookingInquiryOrmEntity>,
    @Inject(ARTIST_ACCESS_POLICY)
    private readonly artistPolicy: ArtistAccessPolicyPort,
    @Inject(VENUE_ACCESS_POLICY)
    private readonly venuePolicy: VenueAccessPolicyPort,
  ) {}

  async ensureActorIsRequesterForInquiry(actorUserId: string, inquiryId: string): Promise<void> {
    const row = await this.inquiries.findOne({ where: { id: inquiryId } });
    if (!row) throw new ResourceNotFoundError("Inquiry não encontrada");
    if (row.requesterUserId !== actorUserId) {
      throw new AccessDeniedError("Apenas o solicitante pode executar esta ação");
    }
  }

  async ensureActorIsCounterpartForInquiry(actorUserId: string, inquiryId: string): Promise<void> {
    const row = await this.inquiries.findOne({ where: { id: inquiryId } });
    if (!row) throw new ResourceNotFoundError("Inquiry não encontrada");
    if (row.artistId) {
      await this.artistPolicy.ensureActorOwnsArtist(actorUserId, row.artistId);
      return;
    }
    if (row.venueId) {
      await this.venuePolicy.ensureActorOwnsVenue(actorUserId, row.venueId);
      return;
    }
    throw new AccessDeniedError("Inquiry sem contraparte definida");
  }
}
