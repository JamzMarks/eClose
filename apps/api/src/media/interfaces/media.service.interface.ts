import { MediaAsset } from "../entity/media-asset.entity";
import { RegisterMediaAssetDto } from "../dto/register-media-asset.dto";
import { RequestUploadIntentDto } from "../dto/request-upload-intent.dto";
import { MediaParentType } from "../types/media-parent-type.type";
import { SignedUploadIntentResult } from "../types/signed-upload-intent.type";

/**
 * Porta de mídia: registro de URLs (MVP), primários, galeria.
 * Evolução: upload assinado, transcode, thumbnails — sem mudar consumidores.
 */
export interface IMediaService {
  registerAsset(dto: RegisterMediaAssetDto): Promise<MediaAsset>;
  requestSignedUploadIntent(dto: RequestUploadIntentDto): Promise<SignedUploadIntentResult>;
  findById(id: string): Promise<MediaAsset | null>;
  listByParent(parentType: MediaParentType, parentId: string): Promise<MediaAsset[]>;
  getPrimary(parentType: MediaParentType, parentId: string): Promise<MediaAsset | null>;
  getPrimaryMany(
    parentType: MediaParentType,
    parentIds: string[],
  ): Promise<Map<string, MediaAsset | null>>;
  /** Define este asset como principal do parent; desmarca os demais */
  setPrimary(assetId: string): Promise<MediaAsset>;
  assertBelongsTo(assetId: string, parentType: MediaParentType, parentId: string): Promise<void>;
}
