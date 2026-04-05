import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventPersistenceModule } from "@/event/event-persistence.module";
import { FriendshipModule } from "@/friendship/friendship.module";
import { SharedEventListService } from "@/shared-event-list/application/shared-event-list.service";
import { SharedEventListItemOrmEntity } from "@/shared-event-list/infrastructure/persistence/shared-event-list-item.orm-entity";
import { SharedEventListMemberOrmEntity } from "@/shared-event-list/infrastructure/persistence/shared-event-list-member.orm-entity";
import { SharedEventListOrmEntity } from "@/shared-event-list/infrastructure/persistence/shared-event-list.orm-entity";
import { SharedEventListController } from "@/shared-event-list/interface/http/shared-event-list.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SharedEventListOrmEntity,
      SharedEventListMemberOrmEntity,
      SharedEventListItemOrmEntity,
    ]),
    FriendshipModule,
    EventPersistenceModule,
  ],
  controllers: [SharedEventListController],
  providers: [SharedEventListService],
  exports: [SharedEventListService],
})
export class SharedEventListModule {}
