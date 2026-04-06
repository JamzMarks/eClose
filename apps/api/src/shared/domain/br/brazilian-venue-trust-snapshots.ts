/**
 * Modelos estáveis para validação de confiança de venue (CNPJ + CEP no Brasil).
 * Independentes do fornecedor HTTP — trocar API = novo adapter + mapper wire → estes tipos.
 */

export type BrazilianPostalCodeLocationSnapshot = {
  postalCodeDigits: string;
  uf: string;
  /** `normalizeCityForCompare` já aplicado. */
  cityComparable: string;
};

export type CompanyRegistryTrustSnapshot = {
  cnpj14: string;
  registeredPostalCodeDigits: string | null;
  uf: string | null;
  /** `normalizeCityForCompare` já aplicado. */
  municipalityComparable: string | null;
  cadastralSituationLabel: string | null;
  isActiveRegistration: boolean;
};
