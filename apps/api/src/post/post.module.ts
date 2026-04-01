import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { PostOrmEntity } from "@/post/infrastructure/persistence/post.orm-entity";
import { POST_REPOSITORY } from "@/post/application/ports/post.repository.port";
import { TypeormPostRepository } from "@/post/infrastructure/typeorm-post.repository";
import { PostService } from "@/post/application/post.service";
import { POST_SERVICE } from "@/post/tokens/post.tokens";
import { PostController } from "./post.controller";
import { POST_ACCESS_POLICY } from "@/post/application/ports/post-access.policy.port";
import { PostAccessPolicyImpl } from "@/post/infrastructure/post-access.policy.impl";
import { EventPersistenceModule } from "@/event/event-persistence.module";
import { ArtistModule } from "@/artist/artist.module";
import { VenueModule } from "@/venue/venue.module";
import { FriendshipModule } from "@/friendship/friendship.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PostOrmEntity, UserOrmEntity]),
    EventPersistenceModule,
    ArtistModule,
    VenueModule,
    FriendshipModule,
  ],
  controllers: [PostController],
  providers: [
    { provide: POST_REPOSITORY, useClass: TypeormPostRepository },
    { provide: POST_ACCESS_POLICY, useClass: PostAccessPolicyImpl },
    { provide: POST_SERVICE, useClass: PostService },
  ],
  exports: [POST_SERVICE],
})
export class PostModule {}
