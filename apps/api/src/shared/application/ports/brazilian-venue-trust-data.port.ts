import type {
  BrazilianPostalCodeLocationSnapshot,
  CompanyRegistryTrustSnapshot,
} from "@/shared/domain/br/brazilian-venue-trust-snapshots";

/**
 * Porta: dados públicos brasileiros para cruzar endereço do venue com CNPJ/CEP.
 * Implementações: ex. HTTP BrasilAPI + mapper; no futuro ReceitaWS, outro agregador, etc.
 */
export interface IBrazilianVenueTrustDataPort {
  /** `postalCodeDigits` com exatamente 8 dígitos. */
  lookupLocationByPostalCode(postalCodeDigits8: string): Promise<BrazilianPostalCodeLocationSnapshot>;

  /** `cnpj14` com exatamente 14 dígitos. */
  lookupCompanyByCnpj(cnpj14: string): Promise<CompanyRegistryTrustSnapshot>;
}

export const BRAZILIAN_VENUE_TRUST_DATA_PORT = Symbol("BRAZILIAN_VENUE_TRUST_DATA_PORT");
