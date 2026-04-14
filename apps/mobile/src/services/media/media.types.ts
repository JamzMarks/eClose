/** Resposta de `POST /media/upload-intent` (alinhada com a API). */
export type SignedUploadIntentResult = {
  assetId: string;
  storageKey: string;
  uploadUrl: string;
  publicUrl: string;
  httpMethod?: "PUT" | "POST";
  headers?: Record<string, string>;
  fields?: Record<string, string>;
  multipartFieldName?: string;
};

export type MediaParentTypeDto = "ARTIST" | "VENUE" | "EVENT" | "USER";

export type MediaKindDto = "IMAGE" | "VIDEO" | "GIF" | "DOCUMENT";

export type RequestUploadIntentBody = {
  parentType: MediaParentTypeDto;
  parentId: string;
  kind: MediaKindDto;
  expectedMimeType?: string;
  caption?: string;
};

export type RegisterMediaAssetBody = {
  parentType: MediaParentTypeDto;
  parentId: string;
  kind: MediaKindDto;
  sourceUrl: string;
  mimeType?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  caption?: string;
  setAsPrimary?: boolean;
  listable?: boolean;
  storageKey?: string;
};

export type RegisteredMediaAssetDto = {
  id: string;
  parentType: string;
  parentId: string;
  kind: string;
  sourceUrl: string;
  mimeType: string | null;
};
