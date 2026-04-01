import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MediaAssetOrmEntity } from "@/media/infrastructure/persistence/media-asset.orm-entity";
import { MediaAsset } from "../entity/media-asset.entity";
import { IMediaRepository } from "../interfaces/media.repository.interface";
import { MediaKind } from "../types/media-kind.type";
import { MediaParentType } from "../types/media-parent-type.type";

@Injectable()
export class TypeormMediaRepository implements IMediaRepository {
  constructor(
    @InjectRepository(MediaAssetOrmEntity)
    private readonly repo: Repository<MediaAssetOrmEntity>,
  ) {}

  async save(asset: MediaAsset): Promise<void> {
    await this.repo.save(this.toRow(asset));
  }

  async findById(id: string): Promise<MediaAsset | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async listByParent(parentType: MediaParentType, parentId: string): Promise<MediaAsset[]> {
    const rows = await this.repo.find({
      where: { parentType, parentId },
      order: { sortOrder: "ASC", createdAt: "ASC" },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findPrimary(parentType: MediaParentType, parentId: string): Promise<MediaAsset | null> {
    const row = await this.repo.findOne({ where: { parentType, parentId, isPrimary: true } });
    return row ? this.toDomain(row) : null;
  }

  async findPrimariesForParents(
    parentType: MediaParentType,
    parentIds: string[],
  ): Promise<Map<string, MediaAsset>> {
    const out = new Map<string, MediaAsset>();
    if (parentIds.length === 0) return out;
    const rows = await this.repo
      .createQueryBuilder("m")
      .where("m.parentType = :pt", { pt: parentType })
      .andWhere("m.parentId IN (:...ids)", { ids: parentIds })
      .andWhere("m.isPrimary = true")
      .getMany();
    for (const row of rows) {
      out.set(row.parentId, this.toDomain(row));
    }
    return out;
  }

  private toRow(a: MediaAsset): MediaAssetOrmEntity {
    const row = new MediaAssetOrmEntity();
    row.id = a.id;
    row.parentType = a.parentType;
    row.parentId = a.parentId;
    row.kind = a.kind;
    row.sourceUrl = a.sourceUrl;
    row.storageKey = a.storageKey;
    row.thumbnailUrl = a.thumbnailUrl;
    row.cdnUrl = a.cdnUrl;
    row.processingStatus = a.processingStatus;
    row.mimeType = a.mimeType;
    row.width = a.width;
    row.height = a.height;
    row.durationSeconds = a.durationSeconds;
    row.caption = a.caption;
    row.sortOrder = a.sortOrder;
    row.isPrimary = a.isPrimary;
    row.createdAt = a.createdAt;
    return row;
  }

  private toDomain(row: MediaAssetOrmEntity): MediaAsset {
    return MediaAsset.hydrate({
      id: row.id,
      parentType: row.parentType as MediaParentType,
      parentId: row.parentId,
      kind: row.kind as MediaKind,
      sourceUrl: row.sourceUrl,
      storageKey: row.storageKey,
      thumbnailUrl: row.thumbnailUrl,
      cdnUrl: row.cdnUrl,
      processingStatus: row.processingStatus,
      mimeType: row.mimeType,
      width: row.width,
      height: row.height,
      durationSeconds: row.durationSeconds,
      caption: row.caption,
      sortOrder: row.sortOrder,
      isPrimary: row.isPrimary,
      createdAt: row.createdAt,
    });
  }
}
