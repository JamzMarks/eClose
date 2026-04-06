import { Venue } from "@/venue/domain/entity/venue.entity";
import { CreateVenueDto } from "@/venue/interface/http/dto/create-venue.dto";
import { SubmitVenueTrustVerificationDto } from "@/venue/interface/http/dto/submit-venue-trust-verification.dto";

export type VenueTrustReviewDecision = {
  status: "verified_l2" | "rejected";
  rejectionReason?: string | null;
};

export interface IVenueService {
  create(dto: CreateVenueDto): Promise<Venue>;
  getById(id: string): Promise<Venue | null>;
  listActive(): Promise<Venue[]>;
  /** GET públicos: só listados no marketplace e activos. */
  getPublicById(id: string): Promise<Venue | null>;
  listPublicMarketplace(): Promise<Venue[]>;
  linkPrimaryMedia(venueId: string, mediaAssetId: string): Promise<Venue>;
  submitTrustVerification(
    venueId: string,
    dto: SubmitVenueTrustVerificationDto,
    actorUserId: string | null,
  ): Promise<Venue>;
  internalSetTrustReview(venueId: string, decision: VenueTrustReviewDecision): Promise<Venue>;
}
