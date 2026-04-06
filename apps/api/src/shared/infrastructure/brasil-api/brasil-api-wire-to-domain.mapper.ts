import type {
  BrazilianPostalCodeLocationSnapshot,
  CompanyRegistryTrustSnapshot,
} from "@/shared/domain/br/brazilian-venue-trust-snapshots";
import {
  digitsOnly,
  normalizeBrazilianCepDigits,
  normalizeCityForCompare,
  normalizeUf,
} from "@/shared/domain/br/address-normalization";
import type { BrasilApiCepV2WireDto, BrasilApiCnpjV1WireDto } from "./brasil-api.wire-dto";

export function mapBrasilApiCepV2ToPostalLocationSnapshot(
  wire: BrasilApiCepV2WireDto,
): BrazilianPostalCodeLocationSnapshot | null {
  const postalCodeDigits = normalizeBrazilianCepDigits(wire.cep);
  if (!postalCodeDigits) return null;
  return {
    postalCodeDigits,
    uf: normalizeUf(wire.state),
    cityComparable: normalizeCityForCompare(wire.city),
  };
}

export function mapBrasilApiCnpjV1ToCompanyTrustSnapshot(
  wire: BrasilApiCnpjV1WireDto,
): CompanyRegistryTrustSnapshot | null {
  const cnpj14 = digitsOnly(wire.cnpj ?? "");
  if (cnpj14.length !== 14) return null;

  const situacaoTxt = (wire.descricao_situacao_cadastral ?? "").trim().toUpperCase();
  const isActiveRegistration =
    situacaoTxt === "ATIVA" ||
    (situacaoTxt === "" && wire.situacao_cadastral === 2);

  return {
    cnpj14,
    registeredPostalCodeDigits: normalizeBrazilianCepDigits(wire.cep ?? undefined),
    uf: wire.uf != null && String(wire.uf).trim() ? normalizeUf(wire.uf) : null,
    municipalityComparable: wire.municipio?.trim()
      ? normalizeCityForCompare(wire.municipio)
      : null,
    cadastralSituationLabel: wire.descricao_situacao_cadastral?.trim() ?? null,
    isActiveRegistration,
  };
}
