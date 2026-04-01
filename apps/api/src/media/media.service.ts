import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { OutboxEventOrmEntity } from "@/media/infrastructure/persistence/outbox-event.orm-entity";
import { ID_GENERATOR, IdGenerator } from "@/shared/contracts/id-generator";
import { MediaAsset } from "./entity/media-asset.entity";
import { RegisterMediaAssetDto } from "./dto/register-media-asset.dto";
import { RequestUploadIntentDto } from "./dto/request-upload-intent.dto";
import { IMediaRepository } from "./interfaces/media.repository.interface";
import { IMediaService } from "./interfaces/media.service.interface";
import {
  getAllowedImageMimes,
  MEDIA_PROCESSING_PENDING,
  MEDIA_PROCESSING_READY,
} from "./media.constants";
import { MEDIA_REPOSITORY } from "./tokens/media.tokens";
import { MediaKind } from "./types/media-kind.type";
import { MediaParentType } from "./types/media-parent-type.type";
import { SignedUploadIntentResult } from "./types/signed-upload-intent.type";

@Injectable()
export class MediaService implements IMediaService {
  constructor(
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
    @Inject(MEDIA_REPOSITORY) private readonly repo: IMediaRepository,
    @InjectRepository(OutboxEventOrmEntity)
    private readonly outbox: Repository<OutboxEventOrmEntity>,
  ) {}

  async requestSignedUploadIntent(dto: RequestUploadIntentDto): Promise<SignedUploadIntentResult> {
    if (dto.kind === MediaKind.IMAGE) {
      const mimes = getAllowedImageMimes();
      if (dto.expectedMimeType && !mimes.has(dto.expectedMimeType.toLowerCase())) {
        throw new BadRequestException(
          `MIME não permitido para imagem. Permitidos: ${[...mimes].join(", ")}`,
        );
      }
    }
    const assetId = this.ids.generate();
    const storageKey = `media/${dto.parentType}/${dto.parentId}/${assetId}`;
    const cdn = (
      process.env.MEDIA_CDN_PUBLIC_BASE_URL ??
      process.env.CDN_PUBLIC_URL ??
      ""
    ).replace(/\/$/, "");
    const uploadBase = (process.env.MEDIA_UPLOAD_BASE_URL ?? "").replace(/\/$/, "");
    if (!cdn || !uploadBase) {
      throw new ServiceUnavailableException(
        "Configure MEDIA_CDN_PUBLIC_BASE_URL (ou CDN_PUBLIC_URL) e MEDIA_UPLOAD_BASE_URL para upload assinado.",
      );
    }
    const publicUrl = `${cdn}/${storageKey}`;
    const uploadUrl = `${uploadBase}/${storageKey}`;
    return {
      assetId,
      storageKey,
      uploadUrl,
      publicUrl,
      fields: {
        "Content-Type": dto.expectedMimeType ?? "application/octet-stream",
      },
    };
  }

  async registerAsset(dto: RegisterMediaAssetDto): Promise<MediaAsset> {
    if (dto.kind === MediaKind.IMAGE && dto.mimeType) {
      const mimes = getAllowedImageMimes();
      if (!mimes.has(dto.mimeType.toLowerCase())) {
        throw new BadRequestException(
          `MIME não permitido para imagem. Permitidos: ${[...mimes].join(", ")}`,
        );
      }
    }

    const asyncPipeline = process.env.MEDIA_ASYNC_PIPELINE === "true";
    const processingStatus =
      asyncPipeline && dto.kind === MediaKind.IMAGE ? MEDIA_PROCESSING_PENDING : MEDIA_PROCESSING_READY;

    const cdnPrefix = (process.env.MEDIA_CDN_PUBLIC_BASE_URL ?? process.env.CDN_PUBLIC_URL ?? "").replace(
      /\/$/,
      "",
    );
    const cdnUrl = cdnPrefix || null;

    const asset = MediaAsset.register({
      id: this.ids.generate(),
      parentType: dto.parentType,
      parentId: dto.parentId,
      kind: dto.kind,
      sourceUrl: dto.sourceUrl,
      storageKey: dto.storageKey ?? null,
      thumbnailUrl: null,
      cdnUrl,
      processingStatus,
      mimeType: dto.mimeType ?? null,
      width: dto.width ?? null,
      height: dto.height ?? null,
      durationSeconds: dto.durationSeconds ?? null,
      caption: dto.caption ?? null,
      isPrimary: dto.setAsPrimary ?? false,
    });

    if (asset.isPrimary && processingStatus === MEDIA_PROCESSING_READY) {
      await this.clearPrimaryForParent(dto.parentType, dto.parentId);
    }

    await this.repo.save(asset);

    if (asyncPipeline && processingStatus === MEDIA_PROCESSING_PENDING) {
      const row = new OutboxEventOrmEntity();
      row.id = randomUUID();
      row.type = "MediaAssetQueued";
      row.payload = { assetId: asset.id };
      row.processedAt = null;
      await this.outbox.save(row);
    }

    return asset;
  }

  async listByParent(parentType: MediaParentType, parentId: string): Promise<MediaAsset[]> {
    return this.repo.listByParent(parentType, parentId);
  }

  async getPrimary(parentType: MediaParentType, parentId: string): Promise<MediaAsset | null> {
    return this.repo.findPrimary(parentType, parentId);
  }

  async getPrimaryMany(
    parentType: MediaParentType,
    parentIds: string[],
  ): Promise<Map<string, MediaAsset | null>> {
    const uniq = [...new Set(parentIds)];
    const found = await this.repo.findPrimariesForParents(parentType, uniq);
    const out = new Map<string, MediaAsset | null>();
    for (const id of uniq) {
      out.set(id, found.get(id) ?? null);
    }
    return out;
  }

  async setPrimary(assetId: string): Promise<MediaAsset> {
    const asset = await this.repo.findById(assetId);
    if (!asset) throw new NotFoundException("Mídia não encontrada");
    await this.clearPrimaryForParent(asset.parentType, asset.parentId);
    asset.isPrimary = true;
    await this.repo.save(asset);
    return asset;
  }

  async assertBelongsTo(
    assetId: string,
    parentType: MediaParentType,
    parentId: string,
  ): Promise<void> {
    const asset = await this.repo.findById(assetId);
    if (!asset || asset.parentType !== parentType || asset.parentId !== parentId) {
      throw new BadRequestException("Mídia não pertence a este recurso");
    }
  }

  private async clearPrimaryForParent(
    parentType: MediaParentType,
    parentId: string,
  ): Promise<void> {
    const list = await this.repo.listByParent(parentType, parentId);
    for (const a of list) {
      if (a.isPrimary) {
        a.isPrimary = false;
        await this.repo.save(a);
      }
    }
  }
}
