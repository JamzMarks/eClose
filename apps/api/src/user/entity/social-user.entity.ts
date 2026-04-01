/**
 * Cadastro inicial pensado para concluir na própria app
 * confirmação de e-mail/SMS via código ou deep link in-app, usando NotificationService.
 */
export type SocialUserProps = {
  id: string;
  displayName: string;
  /** handle único opcional; pode ser definido depois do signup */
  handle?: string | null;
  email: string | null;
  phone: string | null;
  passwordHash: string | null;
  birthDate: Date;
  /** ISO 3166-1 alpha-2 — regras de maioridade variam por jurisdição */
  countryCode: string | null;
  /** BCP 47 */
  locale: string | null;
  avatarUrl: string | null;
  bio: string | null;
  /** Ex.: gêneros musicais, tipos de evento (completar perfil depois) */
  eventInterests: string[];
  emailVerifiedAt: Date | null;
  phoneVerifiedAt: Date | null;
  termsAcceptedAt: Date;
  privacyAcceptedAt: Date;
  marketingOptIn: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class SocialUser {
  id: string;
  displayName: string;
  handle: string | null;
  email: string | null;
  phone: string | null;
  passwordHash: string | null;
  birthDate: Date;
  countryCode: string | null;
  locale: string | null;
  avatarUrl: string | null;
  bio: string | null;
  eventInterests: string[];
  emailVerifiedAt: Date | null;
  phoneVerifiedAt: Date | null;
  termsAcceptedAt: Date;
  privacyAcceptedAt: Date;
  marketingOptIn: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  private constructor(props: SocialUserProps) {
    Object.assign(this, props);
  }

  static hydrate(props: SocialUserProps): SocialUser {
    return new SocialUser(props);
  }

  /**
   * Fluxo mínimo: identidade (e-mail ou telefone), idade, senha, aceites legais.
   */
  static registerQuick(props: {
    id: string;
    displayName: string;
    email: string | null;
    phone: string | null;
    passwordHash: string;
    birthDate: Date;
    countryCode?: string | null;
    locale?: string | null;
    marketingOptIn: boolean;
    now?: Date;
  }): SocialUser {
    const now = props.now ?? new Date();
    if (!props.displayName?.trim()) throw new Error("Nome de exibição é obrigatório");
    if (!props.email && !props.phone) throw new Error("E-mail ou telefone é obrigatório");
    if (!props.passwordHash) throw new Error("Senha é obrigatória");
    if (!props.birthDate) throw new Error("Data de nascimento é obrigatória");

    return new SocialUser({
      id: props.id,
      displayName: props.displayName.trim(),
      handle: null,
      email: props.email?.trim().toLowerCase() ?? null,
      phone: props.phone?.trim() ?? null,
      passwordHash: props.passwordHash,
      birthDate: props.birthDate,
      countryCode: props.countryCode?.toUpperCase() ?? null,
      locale: props.locale ?? "pt-BR",
      avatarUrl: null,
      bio: null,
      eventInterests: [],
      emailVerifiedAt: null,
      phoneVerifiedAt: null,
      termsAcceptedAt: now,
      privacyAcceptedAt: now,
      marketingOptIn: props.marketingOptIn,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  getAge(reference: Date = new Date()): number {
    let age = reference.getFullYear() - this.birthDate.getFullYear();
    const m = reference.getMonth() - this.birthDate.getMonth();
    const d = reference.getDate() - this.birthDate.getDate();
    if (m < 0 || (m === 0 && d < 0)) age--;
    return age;
  }

  /** MVP: maioridade fixa 18; depois pode usar countryCode + tabela legal */
  meetsMinimumEventAge(minimumAge = 18, reference?: Date): boolean {
    return this.getAge(reference) >= minimumAge;
  }

  markEmailVerified(at: Date = new Date()): void {
    this.emailVerifiedAt = at;
    this.updatedAt = at;
  }

  markPhoneVerified(at: Date = new Date()): void {
    this.phoneVerifiedAt = at;
    this.updatedAt = at;
  }
}
