import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaAssetOrmEntity } from "@/media/infrastructure/persistence/media-asset.orm-entity";
import { OutboxEventOrmEntity } from "@/media/infrastructure/persistence/outbox-event.orm-entity";
import { MediaAsyncPipelineService } from "./infrastructure/media-async-pipeline.service";
import { TypeormMediaRepository } from "./infrastructure/typeorm-media.repository";
import { MediaController } from "./media.controller";
import { MediaService } from "./application/media.service";
import { MEDIA_REPOSITORY, MEDIA_SERVICE } from "./tokens/media.tokens";

@Module({
  imports: [TypeOrmModule.forFeature([MediaAssetOrmEntity, OutboxEventOrmEntity])],
  controllers: [MediaController],
  providers: [
    { provide: MEDIA_REPOSITORY, useClass: TypeormMediaRepository },
    { provide: MEDIA_SERVICE, useClass: MediaService },
    MediaAsyncPipelineService,
  ],
  exports: [MEDIA_SERVICE, MEDIA_REPOSITORY],
})
export class MediaModule {}
