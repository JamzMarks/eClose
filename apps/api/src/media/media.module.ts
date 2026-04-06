import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MEDIA_OBJECT_STORAGE_PORT } from "@/media/application/ports/media-object-storage.port";
import { MediaAssetOrmEntity } from "@/media/infrastructure/persistence/media-asset.orm-entity";
import { OutboxEventOrmEntity } from "@/media/infrastructure/persistence/outbox-event.orm-entity";
import { createMediaObjectStorageAdapter } from "@/media/infrastructure/object-storage/media-object-storage.adapter.factory";
import { MediaAsyncPipelineService } from "./infrastructure/media-async-pipeline.service";
import { TypeormMediaRepository } from "./infrastructure/typeorm-media.repository";
import { LocalMediaBlobController } from "./interface/http/local-media-blob.controller";
import { MediaController } from "./media.controller";
import { MediaService } from "./application/media.service";
import { MEDIA_REPOSITORY, MEDIA_SERVICE } from "./tokens/media.tokens";

@Module({
  imports: [TypeOrmModule.forFeature([MediaAssetOrmEntity, OutboxEventOrmEntity])],
  controllers: [MediaController, LocalMediaBlobController],
  providers: [
    { provide: MEDIA_REPOSITORY, useClass: TypeormMediaRepository },
    {
      provide: MEDIA_OBJECT_STORAGE_PORT,
      useFactory: () => createMediaObjectStorageAdapter(),
    },
    { provide: MEDIA_SERVICE, useClass: MediaService },
    MediaAsyncPipelineService,
  ],
  exports: [MEDIA_SERVICE, MEDIA_REPOSITORY],
})
export class MediaModule {}
