/**
 * Formato JSON do fornecedor BrasilAPI (camada wire).
 * Não usar fora de `infrastructure/brasil-api` + mappers.
 */
export type BrasilApiCnpjV1WireDto = {
  cnpj: string;
  cep?: string | null;
  uf?: string | null;
  municipio?: string | null;
  descricao_situacao_cadastral?: string | null;
  situacao_cadastral?: number | null;
};

export type BrasilApiCepV2WireDto = {
  cep: string;
  state: string;
  city: string;
  neighborhood?: string | null;
  street?: string | null;
};
