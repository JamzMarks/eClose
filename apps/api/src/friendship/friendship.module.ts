import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { FriendRequestOrmEntity } from "@/friendship/infrastructure/persistence/friend-request.orm-entity";
import { UserBlockOrmEntity } from "@/friendship/infrastructure/persistence/user-block.orm-entity";
import { FRIENDSHIP_REPOSITORY } from "@/friendship/application/ports/friendship.repository.port";
import { USER_BLOCK_REPOSITORY } from "@/friendship/application/ports/user-block.repository.port";
import { TypeormFriendshipRepository } from "@/friendship/infrastructure/typeorm-friendship.repository";
import { TypeormUserBlockRepository } from "@/friendship/infrastructure/typeorm-user-block.repository";
import { FriendshipService } from "@/friendship/application/friendship.service";
import { FRIENDSHIP_SERVICE } from "@/friendship/tokens/friendship.tokens";
import { FriendshipController } from "./friendship.controller";
import { NotificationModule } from "@/notification/notification.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequestOrmEntity, UserBlockOrmEntity, UserOrmEntity]),
    NotificationModule,
  ],
  controllers: [FriendshipController],
  providers: [
    { provide: FRIENDSHIP_REPOSITORY, useClass: TypeormFriendshipRepository },
    { provide: USER_BLOCK_REPOSITORY, useClass: TypeormUserBlockRepository },
    { provide: FRIENDSHIP_SERVICE, useClass: FriendshipService },
  ],
  exports: [FRIENDSHIP_SERVICE, FRIENDSHIP_REPOSITORY, USER_BLOCK_REPOSITORY],
})
export class FriendshipModule {}
