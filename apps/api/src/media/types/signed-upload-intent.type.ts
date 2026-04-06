export type SignedUploadIntentResult = {
  assetId: string;
  storageKey: string;
  /** URL para PUT/POST direto ao storage (ex. presigned S3 / SAS Azure) */
  uploadUrl: string;
  /** URL pública final após upload (prefixo CDN + storageKey) */
  publicUrl: string;
  /** Método HTTP esperado pelo storage (presigned PUT é o mais comum). */
  httpMethod?: "PUT" | "POST";
  /** Cabeçalhos obrigatórios no upload (ex.: Content-Type alinhado à assinatura). */
  headers?: Record<string, string>;
  /** Campos extras (ex.: legado / POST policy). */
  fields?: Record<string, string>;
  /** Modo local: enviar `multipart/form-data` com este nome de campo. */
  multipartFieldName?: string;
};
