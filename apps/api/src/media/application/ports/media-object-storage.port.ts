/**
 * Armazenamento de objectos para uploads de media (S3, Azure Blob, CDN+proxy, etc.).
 * O domínio de media usa só esta porta — trocar cloud = novo adapter.
 */

export type MediaObjectStorageUploadIntentRequest = {
  /** Caminho lógico único (ex.: `media/VENUE/{id}/{assetId}`). */
  storageKey: string;
  expectedMimeType?: string | null;
  /** Validade do URL assinado (segundos). */
  expiresInSeconds?: number;
};

export type MediaObjectStorageHttpMethod = "PUT" | "POST";

/**
 * Resultado estável para o cliente fazer upload direto ao storage.
 */
export type MediaObjectStorageUploadIntent = {
  storageKey: string;
  /** URL para enviar o ficheiro (presigned PUT, SAS, ou prefixo configurável). */
  uploadTargetUrl: string;
  httpMethod: MediaObjectStorageHttpMethod;
  /** URL que a app gravará em `sourceUrl` após upload bem-sucedido. */
  publicReadUrl: string;
  /** Campos de formulário (ex.: POST policy S3 legado). */
  formFields?: Record<string, string>;
  /** Cabeçalhos que o cliente deve enviar (ex.: Content-Type no PUT presigned). */
  uploadHeaders?: Record<string, string>;
  /** Para `POST` multipart (modo local): nome do campo do ficheiro. */
  multipartFieldName?: string;
};

export interface IMediaObjectStoragePort {
  createUploadIntent(
    request: MediaObjectStorageUploadIntentRequest,
  ): Promise<MediaObjectStorageUploadIntent>;
}

export const MEDIA_OBJECT_STORAGE_PORT = Symbol("MEDIA_OBJECT_STORAGE_PORT");
