import type {
  RegisterVenueMediaBody,
  RegisteredMediaAssetDto,
} from "@/services/media/media.service";

export function localRegisteredMediaAsset(
  body: RegisterVenueMediaBody,
): RegisteredMediaAssetDto {
  return {
    id: `media_local_${Date.now()}`,
    parentType: body.parentType,
    parentId: body.parentId,
    kind: body.kind,
    sourceUrl: body.sourceUrl,
    mimeType: body.mimeType ?? null,
  };
}
