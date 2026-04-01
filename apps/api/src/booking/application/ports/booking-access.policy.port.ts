export interface BookingAccessPolicyPort {
  ensureActorIsRequesterForInquiry(actorUserId: string, inquiryId: string): Promise<void>;
  ensureActorIsCounterpartForInquiry(actorUserId: string, inquiryId: string): Promise<void>;
}

export const BOOKING_ACCESS_POLICY = Symbol("BOOKING_ACCESS_POLICY");
