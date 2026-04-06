import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import type { IBrazilianVenueTrustDataPort } from "@/shared/application/ports/brazilian-venue-trust-data.port";
import type {
  BrazilianPostalCodeLocationSnapshot,
  CompanyRegistryTrustSnapshot,
} from "@/shared/domain/br/brazilian-venue-trust-snapshots";
import type { BrasilApiCepV2WireDto, BrasilApiCnpjV1WireDto } from "./brasil-api.wire-dto";
import {
  mapBrasilApiCepV2ToPostalLocationSnapshot,
  mapBrasilApiCnpjV1ToCompanyTrustSnapshot,
} from "./brasil-api-wire-to-domain.mapper";

/**
 * Implementação atual: HTTP contra BrasilAPI + mappers para snapshots de domínio.
 * Para outro fornecedor, criar novo adapter implementando {@link IBrazilianVenueTrustDataPort}.
 */
@Injectable()
export class BrasilApiTrustDataAdapter implements IBrazilianVenueTrustDataPort {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor() {
    this.baseUrl = (process.env.BRASILAPI_BASE_URL ?? "https://brasilapi.com.br/api").replace(
      /\/$/,
      "",
    );
    const raw = process.env.BRASILAPI_TIMEOUT_MS;
    this.timeoutMs = raw ? Math.min(60_000, Math.max(3_000, parseInt(raw, 10) || 15_000)) : 15_000;
  }

  async lookupLocationByPostalCode(
    postalCodeDigits8: string,
  ): Promise<BrazilianPostalCodeLocationSnapshot> {
    const wire = await this.getJsonWire<BrasilApiCepV2WireDto>(
      `${this.baseUrl}/cep/v2/${encodeURIComponent(postalCodeDigits8)}`,
      "cep",
    );
    const mapped = mapBrasilApiCepV2ToPostalLocationSnapshot(wire);
    if (!mapped) {
      throw new ServiceUnavailableException(
        "O fornecedor de CEP devolveu dados inválidos; tenta novamente mais tarde.",
      );
    }
    return mapped;
  }

  async lookupCompanyByCnpj(cnpj14: string): Promise<CompanyRegistryTrustSnapshot> {
    const wire = await this.getJsonWire<BrasilApiCnpjV1WireDto>(
      `${this.baseUrl}/cnpj/v1/${encodeURIComponent(cnpj14)}`,
      "cnpj",
    );
    const mapped = mapBrasilApiCnpjV1ToCompanyTrustSnapshot(wire);
    if (!mapped) {
      throw new BadRequestException(
        "A consulta de CNPJ devolveu dados inválidos; confirma o número.",
      );
    }
    return mapped;
  }

  private async getJsonWire<T>(url: string, kind: "cnpj" | "cep"): Promise<T> {
    let res: Response;
    try {
      res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch {
      throw new ServiceUnavailableException(
        "Não foi possível contactar o fornecedor de dados (CNPJ/CEP). Tenta novamente mais tarde.",
      );
    }

    if (res.status === 404) {
      if (kind === "cnpj") {
        throw new BadRequestException("CNPJ não encontrado na base consultada.");
      }
      throw new BadRequestException(
        "CEP não encontrado. Confirma o CEP no endereço do espaço.",
      );
    }

    if (res.status === 400) {
      throw new BadRequestException(
        kind === "cnpj" ? "CNPJ inválido para consulta." : "CEP inválido para consulta.",
      );
    }

    if (!res.ok) {
      throw new ServiceUnavailableException(
        `Fornecedor de dados indisponível (${kind}, HTTP ${res.status}). Tenta novamente mais tarde.`,
      );
    }

    try {
      return (await res.json()) as T;
    } catch {
      throw new ServiceUnavailableException("Resposta inválida do fornecedor de dados.");
    }
  }
}
