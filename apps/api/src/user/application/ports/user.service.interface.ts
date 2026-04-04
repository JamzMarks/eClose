import { CompleteProfileNamesDto } from "@/user/interface/http/dto/complete-profile-names.dto";
import { QuickSignupDto } from "@/user/interface/http/dto/quick-signup.dto";
import { UpdateNotificationPreferencesDto } from "@/user/interface/http/dto/update-notification-preferences.dto";
import { UpdatePushTokensDto } from "@/user/interface/http/dto/update-push-tokens.dto";
import { SocialUser } from "@/user/domain/entity/social-user.entity";
import type { SessionUserSnapshot } from "@/user/domain/types/session-user-snapshot";

export type UserNotificationPreferences = { email: boolean; push: boolean; sms: boolean };

export type LinkedArtistSummary = { kind: "artist"; id: string; slug: string; name: string };
export type LinkedVenueSummary = { kind: "venue"; id: string; slug: string; name: string };

export interface IUserService {
  quickSignup(dto: QuickSignupDto): Promise<SocialUser>;
  findById(id: string): Promise<SocialUser | undefined>;
  findAll(): Promise<SocialUser[]>;
  getSessionProfile(userId: string): Promise<SessionUserSnapshot>;
  completeProfileNames(userId: string, dto: CompleteProfileNamesDto): Promise<void>;
  updateEventInterests(userId: string, interests: string[]): Promise<string[]>;
  getNotificationPreferences(userId: string): Promise<UserNotificationPreferences>;
  updateNotificationPreferences(
    userId: string,
    dto: UpdateNotificationPreferencesDto,
  ): Promise<UserNotificationPreferences>;
  getPushTokens(userId: string): Promise<string[]>;
  updatePushTokens(userId: string, dto: UpdatePushTokensDto): Promise<string[]>;
  listLinkedEntities(userId: string): Promise<{
    artists: LinkedArtistSummary[];
    venues: LinkedVenueSummary[];
  }>;
}
