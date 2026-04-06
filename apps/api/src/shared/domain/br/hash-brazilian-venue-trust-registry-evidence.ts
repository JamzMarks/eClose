import { createHash } from "crypto";
import type {
  BrazilianPostalCodeLocationSnapshot,
  CompanyRegistryTrustSnapshot,
} from "@/shared/domain/br/brazilian-venue-trust-snapshots";

/**
 * Hash estável (SHA-256 hex) dos dados públicos usados na validação CNPJ+CEP,
 * para prova mínima sem guardar o JSON completo.
 */
export function hashBrazilianVenueTrustRegistryEvidence(input: {
  venuePostalCodeDigits8: string;
  cnpj14: string;
  postalLocation: BrazilianPostalCodeLocationSnapshot;
  company: CompanyRegistryTrustSnapshot;
}): string {
  const payload = {
    venuePostalCodeDigits8: input.venuePostalCodeDigits8,
    cnpj14: input.cnpj14,
    postal: {
      postalCodeDigits: input.postalLocation.postalCodeDigits,
      uf: input.postalLocation.uf,
      cityComparable: input.postalLocation.cityComparable,
    },
    company: {
      cnpj14: input.company.cnpj14,
      registeredPostalCodeDigits: input.company.registeredPostalCodeDigits,
      uf: input.company.uf,
      municipalityComparable: input.company.municipalityComparable,
      cadastralSituationLabel: input.company.cadastralSituationLabel,
      isActiveRegistration: input.company.isActiveRegistration,
    },
  };
  const json = JSON.stringify(payload);
  return createHash("sha256").update(json, "utf8").digest("hex");
}
