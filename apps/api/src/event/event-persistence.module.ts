import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventOrmEntity } from "@/event/infrastructure/persistence/event.orm-entity";
import { EVENT_REPOSITORY } from "./application/tokens/event.tokens";
import { TypeormEventRepository } from "./infrastructure/typeorm-event.repository";

@Module({
  imports: [TypeOrmModule.forFeature([EventOrmEntity])],
  providers: [{ provide: EVENT_REPOSITORY, useClass: TypeormEventRepository }],
  exports: [EVENT_REPOSITORY],
})
export class EventPersistenceModule {}
