import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostOrmEntity } from "@/post/infrastructure/persistence/post.orm-entity";
import { POST_REPOSITORY } from "@/post/application/ports/post.repository.port";
import { TypeormPostRepository } from "@/post/infrastructure/typeorm-post.repository";
import { PostService } from "@/post/application/post.service";
import { POST_SERVICE } from "@/post/tokens/post.tokens";
import { PostController } from "./post.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PostOrmEntity])],
  controllers: [PostController],
  providers: [
    { provide: POST_REPOSITORY, useClass: TypeormPostRepository },
    { provide: POST_SERVICE, useClass: PostService },
  ],
  exports: [POST_SERVICE],
})
export class PostModule {}
