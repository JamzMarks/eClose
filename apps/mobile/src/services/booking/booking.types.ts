export type BookingInquiryDto = {
  id: string;
  conversationId: string;
  requesterUserId: string;
  artistId: string | null;
  venueId: string | null;
  status: string;
  proposedStartsAt: string | null;
  proposedEndsAt: string | null;
  notes: string | null;
  linkedEventId: string | null;
  requesterOrganizerArtistId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingInquiryBody = {
  artistId?: string;
  venueId?: string;
  organizerArtistId?: string;
  notes?: string;
};
