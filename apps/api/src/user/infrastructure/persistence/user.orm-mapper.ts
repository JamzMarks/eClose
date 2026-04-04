import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { SocialUser } from "@/user/domain/entity/social-user.entity";

export function socialUserFromRow(row: UserOrmEntity): SocialUser {
  return SocialUser.hydrate({
    id: row.id,
    username: row.username ?? "",
    firstName: row.firstName ?? null,
    lastName: row.lastName ?? null,
    handle: row.handle,
    email: row.email,
    phone: row.phone,
    passwordHash: row.passwordHash,
    birthDate: row.birthDate,
    countryCode: row.countryCode,
    locale: row.locale,
    avatarUrl: row.avatarUrl,
    bio: row.bio,
    eventInterests: [...(row.eventInterests ?? [])],
    emailVerifiedAt: row.emailVerifiedAt,
    phoneVerifiedAt: row.phoneVerifiedAt,
    termsAcceptedAt: row.termsAcceptedAt,
    privacyAcceptedAt: row.privacyAcceptedAt,
    marketingOptIn: row.marketingOptIn,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export function applySocialUserToRow(user: SocialUser, row: UserOrmEntity): void {
  row.id = user.id;
  row.username = user.username;
  row.firstName = user.firstName;
  row.lastName = user.lastName;
  row.handle = user.handle;
  row.email = user.email;
  row.phone = user.phone;
  row.passwordHash = user.passwordHash;
  row.birthDate = user.birthDate;
  row.countryCode = user.countryCode;
  row.locale = user.locale;
  row.avatarUrl = user.avatarUrl;
  row.bio = user.bio;
  row.eventInterests = [...user.eventInterests];
  row.emailVerifiedAt = user.emailVerifiedAt;
  row.phoneVerifiedAt = user.phoneVerifiedAt;
  row.termsAcceptedAt = user.termsAcceptedAt;
  row.privacyAcceptedAt = user.privacyAcceptedAt;
  row.marketingOptIn = user.marketingOptIn;
  row.isActive = user.isActive;
  row.createdAt = user.createdAt;
  row.updatedAt = user.updatedAt;
}
