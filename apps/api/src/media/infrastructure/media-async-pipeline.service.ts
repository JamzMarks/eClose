import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { IsNull, Repository } from "typeorm";
import { MediaAssetOrmEntity } from "@/media/infrastructure/persistence/media-asset.orm-entity";
import { OutboxEventOrmEntity } from "@/media/infrastructure/persistence/outbox-event.orm-entity";
import { MEDIA_PROCESSING_READY } from "../media.constants";

/**
 * Worker leve in-process: consome outbox MediaAssetQueued e publica MediaAssetReady (outbox).
 * Ative com MEDIA_ASYNC_PIPELINE=true.
 */
@Injectable()
export class MediaAsyncPipelineService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MediaAsyncPipelineService.name);
  private timer?: ReturnType<typeof setInterval>;

  constructor(
    @InjectRepository(OutboxEventOrmEntity)
    private readonly outbox: Repository<OutboxEventOrmEntity>,
    @InjectRepository(MediaAssetOrmEntity)
    private readonly assets: Repository<MediaAssetOrmEntity>,
  ) {}

  onModuleInit(): void {
    if (process.env.MEDIA_ASYNC_PIPELINE !== "true") return;
    this.timer = setInterval(() => {
      void this.drainOnce();
    }, 5000);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private async drainOnce(): Promise<void> {
    const batch = await this.outbox.find({
      where: { type: "MediaAssetQueued", processedAt: IsNull() },
      take: 20,
      order: { createdAt: "ASC" },
    });
    for (const msg of batch) {
      const assetId = msg.payload?.assetId as string | undefined;
      if (assetId) {
        const asset = await this.assets.findOne({ where: { id: assetId } });
        if (asset) {
          asset.processingStatus = MEDIA_PROCESSING_READY;
          const thumbSuffix = process.env.MEDIA_THUMB_URL_SUFFIX ?? "";
          asset.thumbnailUrl = thumbSuffix ? `${asset.sourceUrl}${thumbSuffix}` : asset.sourceUrl;
          await this.assets.save(asset);
        }
        const ready = new OutboxEventOrmEntity();
        ready.id = randomUUID();
        ready.type = "MediaAssetReady";
        ready.payload = { assetId, sourceEventId: msg.id };
        ready.processedAt = null;
        await this.outbox.save(ready);
      }
      msg.processedAt = new Date();
      await this.outbox.save(msg);
    }
    if (batch.length) {
      this.logger.debug(`Processados ${batch.length} itens MediaAssetQueued`);
    }
  }
}
