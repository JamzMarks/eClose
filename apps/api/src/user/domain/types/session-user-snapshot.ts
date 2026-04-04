/** Snapshot mínimo para sessão / GET auth/me (sem duplicar regras de domínio no AuthModule). */
export type SessionUserSnapshot = {
  id: string;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  emailVerifiedAt: Date | null;
  eventInterests: string[];
  /** Preenchido quando o utilizador confirma nome no onboarding (ou legado migrado). */
  profileNamesAcknowledgedAt: Date | null;
};
