export type SignedUploadIntentResult = {
  assetId: string;
  storageKey: string;
  /** URL para PUT/POST direto ao storage (ex. presigned S3) */
  uploadUrl: string;
  /** URL pública final após upload (prefixo CDN + storageKey) */
  publicUrl: string;
  /** Campos extras para multipart, se aplicável */
  fields?: Record<string, string>;
};
