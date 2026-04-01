import { CreateUserDto } from "@/user/dto/create-user.dto";
import { QuickSignupDto } from "@/user/dto/quick-signup.dto";
import { UpdateNotificationPreferencesDto } from "@/user/dto/update-notification-preferences.dto";
import { UpdatePushTokensDto } from "@/user/dto/update-push-tokens.dto";
import { SocialUser } from "@/user/entity/social-user.entity";

export type UserNotificationPreferences = { email: boolean; push: boolean; sms: boolean };

export type LinkedArtistSummary = { kind: "artist"; id: string; slug: string; name: string };
export type LinkedVenueSummary = { kind: "venue"; id: string; slug: string; name: string };

export interface IUserService {
  quickSignup(dto: QuickSignupDto): Promise<SocialUser>;
  create(dto: CreateUserDto): Promise<SocialUser>;
  findById(id: string): Promise<SocialUser | undefined>;
  findAll(): Promise<SocialUser[]>;
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
