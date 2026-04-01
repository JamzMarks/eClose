import { MediaKind } from "../types/media-kind.type";
import { MediaParentType } from "../types/media-parent-type.type";

export type MediaAssetProps = {
  id: string;
  parentType: MediaParentType;
  parentId: string;
  kind: MediaKind;
  /** URL pública (CDN); MVP aceita URL já hospedada — depois storageKey + pipeline */
  sourceUrl: string;
  storageKey?: string | null;
  thumbnailUrl?: string | null;
  cdnUrl?: string | null;
  processingStatus?: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  /** legenda / alt para UX e acessibilidade */
  caption: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
};

export class MediaAsset {
  id: string;
  parentType: MediaParentType;
  parentId: string;
  kind: MediaKind;
  sourceUrl: string;
  storageKey: string | null;
  thumbnailUrl: string | null;
  cdnUrl: string | null;
  processingStatus: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  caption: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;

  private constructor(props: MediaAssetProps) {
    Object.assign(this, {
      ...props,
      storageKey: props.storageKey ?? null,
      thumbnailUrl: props.thumbnailUrl ?? null,
      cdnUrl: props.cdnUrl ?? null,
      processingStatus: props.processingStatus ?? "READY",
    });
  }

  static hydrate(props: MediaAssetProps): MediaAsset {
    return new MediaAsset(props);
  }

  static register(props: {
    id: string;
    parentType: MediaParentType;
    parentId: string;
    kind: MediaKind;
    sourceUrl: string;
    storageKey?: string | null;
    thumbnailUrl?: string | null;
    cdnUrl?: string | null;
    processingStatus?: string;
    mimeType?: string | null;
    width?: number | null;
    height?: number | null;
    durationSeconds?: number | null;
    caption?: string | null;
    sortOrder?: number;
    isPrimary?: boolean;
    now?: Date;
  }): MediaAsset {
    if (!props.sourceUrl?.trim()) throw new Error("sourceUrl é obrigatório");
    return new MediaAsset({
      id: props.id,
      parentType: props.parentType,
      parentId: props.parentId,
      kind: props.kind,
      sourceUrl: props.sourceUrl.trim(),
      storageKey: props.storageKey ?? null,
      thumbnailUrl: props.thumbnailUrl ?? null,
      cdnUrl: props.cdnUrl ?? null,
      processingStatus: props.processingStatus ?? "READY",
      mimeType: props.mimeType ?? null,
      width: props.width ?? null,
      height: props.height ?? null,
      durationSeconds: props.durationSeconds ?? null,
      caption: props.caption?.trim() ?? null,
      sortOrder: props.sortOrder ?? 0,
      isPrimary: props.isPrimary ?? false,
      createdAt: props.now ?? new Date(),
    });
  }
}
