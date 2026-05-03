import type { RegisteredMediaAssetDto } from "@/contracts/media.types";

export type LocalRegisterMediaInput = {
  parentType: "VENUE" | "EVENT" | "ARTIST" | "USER";
  parentId: string;
  kind: "IMAGE" | "DOCUMENT";
  sourceUrl: string;
  mimeType?: string;
  listable?: boolean;
};

export function localRegisteredMediaAsset(body: LocalRegisterMediaInput): RegisteredMediaAssetDto {
  return {
    id: `media_local_${Date.now()}`,
    parentType: body.parentType,
    parentId: body.parentId,
    kind: body.kind,
    sourceUrl: body.sourceUrl,
    mimeType: body.mimeType ?? null,
  };
}
