export type AuthProfileCompletion = "minimal" | "verified" | "full";

export class UserProfileDto {
  id!: string;
  email!: string;
  username!: string | null;
  firstName!: string | null;
  lastName!: string | null;
  /** Quando o utilizador confirmou o nome no onboarding (ou migração). */
  profileNamesAcknowledgedAt!: string | null;
  /** ISO 8601 ou null se ainda não verificado */
  emailVerifiedAt!: string | null;
  needsEmailVerification!: boolean;
  needsProfileNames!: boolean;
  /** Sugestão de onboarding: nome completo definido mas ainda sem gostos guardados */
  needsEventInterests!: boolean;
  profileCompletion!: AuthProfileCompletion;
}
