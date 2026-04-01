import { MediaAsset } from "../entity/media-asset.entity";
import { MediaParentType } from "../types/media-parent-type.type";

export interface IMediaRepository {
  save(asset: MediaAsset): Promise<void>;
  findById(id: string): Promise<MediaAsset | null>;
  listByParent(parentType: MediaParentType, parentId: string): Promise<MediaAsset[]>;
  findPrimary(parentType: MediaParentType, parentId: string): Promise<MediaAsset | null>;
}
