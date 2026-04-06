import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class UserOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 320, nullable: true, unique: true })
  email!: string | null;

  @Column({ type: "varchar", length: 64, nullable: true, unique: true })
  phone!: string | null;

  @Column({ name: "password_hash", type: "varchar", length: 255, nullable: true })
  passwordHash!: string | null;

  @Column({ name: "username", type: "varchar", length: 255, nullable: true })
  username!: string | null;

  @Column({ name: "first_name", type: "varchar", length: 100, nullable: true })
  firstName!: string | null;

  @Column({ name: "last_name", type: "varchar", length: 100, nullable: true })
  lastName!: string | null;

  @Column({
    name: "profile_names_acknowledged_at",
    type: "timestamptz",
    nullable: true,
  })
  profileNamesAcknowledgedAt!: Date | null;

  @Column({ type: "varchar", length: 64, nullable: true, unique: true })
  handle!: string | null;

  @Column({ name: "birth_date", type: "timestamptz", nullable: true })
  birthDate!: Date | null;

  @Column({ name: "country_code", type: "varchar", length: 2, nullable: true })
  countryCode!: string | null;

  @Column({ type: "varchar", length: 32, nullable: true })
  locale!: string | null;

  @Column({ name: "avatar_url", type: "text", nullable: true })
  avatarUrl!: string | null;

  @Column({ type: "text", nullable: true })
  bio!: string | null;

  @Column({ name: "event_interests", type: "jsonb", default: () => "'[]'" })
  eventInterests!: string[];

  @Column({ name: "email_verified_at", type: "timestamptz", nullable: true })
  emailVerifiedAt!: Date | null;

  @Column({ name: "phone_verified_at", type: "timestamptz", nullable: true })
  phoneVerifiedAt!: Date | null;

  @Column({ name: "terms_accepted_at", type: "timestamptz", nullable: true })
  termsAcceptedAt!: Date | null;

  @Column({ name: "privacy_accepted_at", type: "timestamptz", nullable: true })
  privacyAcceptedAt!: Date | null;

  @Column({ name: "terms_version", type: "varchar", length: 64, nullable: true })
  termsVersion!: string | null;

  @Column({ name: "privacy_version", type: "varchar", length: 64, nullable: true })
  privacyVersion!: string | null;

  @Column({ name: "marketing_opt_in", type: "boolean", default: false })
  marketingOptIn!: boolean;

  @Column({ name: "notification_preferences", type: "jsonb" })
  notificationPreferences!: { email: boolean; push: boolean; sms: boolean };

  @Column({ name: "push_tokens", type: "jsonb" })
  pushTokens!: string[];

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
