import { ArtistOrmEntity } from "@/artist/infrastructure/persistence/artist.orm-entity";
import { OAuthAccountOrmEntity } from "@/auth/infrastructure/persistence/oauth-account.orm-entity";
import { RefreshTokenOrmEntity } from "@/auth/infrastructure/persistence/refresh-token.orm-entity";
import { BookingInquiryOrmEntity } from "@/booking/infrastructure/persistence/booking-inquiry.orm-entity";
import { ArtistUnavailabilityOrmEntity } from "@/calendar/infrastructure/persistence/artist-unavailability.orm-entity";
import { VenueUnavailabilityOrmEntity } from "@/calendar/infrastructure/persistence/venue-unavailability.orm-entity";
import { ConversationOrmEntity } from "@/chat/infrastructure/persistence/conversation.orm-entity";
import { MessageOrmEntity } from "@/chat/infrastructure/persistence/message.orm-entity";
import { EventOrmEntity } from "@/event/infrastructure/persistence/event.orm-entity";
import { MediaAssetOrmEntity } from "@/media/infrastructure/persistence/media-asset.orm-entity";
import { OutboxEventOrmEntity } from "@/media/infrastructure/persistence/outbox-event.orm-entity";
import { NotificationOrmEntity } from "@/notification/infrastructure/persistence/notification.orm-entity";
import { TaxonomyTermOrmEntity } from "@/taxonomy/infrastructure/persistence/taxonomy-term.orm-entity";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { VenueOrmEntity } from "@/venue/infrastructure/persistence/venue.orm-entity";
import { FriendRequestOrmEntity } from "@/friendship/infrastructure/persistence/friend-request.orm-entity";
import { PostOrmEntity } from "@/post/infrastructure/persistence/post.orm-entity";

/** Registro da composição: cada entidade vive no bounded context correspondente. */
export const ALL_TYPEORM_ENTITIES = [
  UserOrmEntity,
  OAuthAccountOrmEntity,
  RefreshTokenOrmEntity,
  TaxonomyTermOrmEntity,
  ArtistOrmEntity,
  VenueOrmEntity,
  EventOrmEntity,
  MediaAssetOrmEntity,
  ConversationOrmEntity,
  MessageOrmEntity,
  NotificationOrmEntity,
  ArtistUnavailabilityOrmEntity,
  VenueUnavailabilityOrmEntity,
  BookingInquiryOrmEntity,
  OutboxEventOrmEntity,
  FriendRequestOrmEntity,
  PostOrmEntity,
];
