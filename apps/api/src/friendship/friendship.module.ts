import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { FriendRequestOrmEntity } from "@/friendship/infrastructure/persistence/friend-request.orm-entity";
import { FRIENDSHIP_REPOSITORY } from "@/friendship/application/ports/friendship.repository.port";
import { TypeormFriendshipRepository } from "@/friendship/infrastructure/typeorm-friendship.repository";
import { FriendshipService } from "@/friendship/application/friendship.service";
import { FRIENDSHIP_SERVICE } from "@/friendship/tokens/friendship.tokens";
import { FriendshipController } from "./friendship.controller";

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequestOrmEntity, UserOrmEntity])],
  controllers: [FriendshipController],
  providers: [
    { provide: FRIENDSHIP_REPOSITORY, useClass: TypeormFriendshipRepository },
    { provide: FRIENDSHIP_SERVICE, useClass: FriendshipService },
  ],
  exports: [FRIENDSHIP_SERVICE],
})
export class FriendshipModule {}
