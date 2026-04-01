import { Body, Controller, Delete, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { CurrentUser } from "@/infrastructure/http/decorators/current-user.decorator";
import { PrivateRoute } from "@/infrastructure/http/metadata/private-route.metadata";
import type { JwtValidatedUser } from "@/auth/strategies/jwt.strategy";
import { CreatePostDto } from "@/post/application/dto/create-post.dto";
import { ListPostsQueryDto } from "@/post/application/dto/list-posts.query";
import { IPostService } from "@/post/application/post.service.interface";
import { POST_SERVICE } from "@/post/tokens/post.tokens";
import { PostScopeType } from "@/post/domain/post-scope.type";

@Controller("posts")
export class PostController {
  constructor(@Inject(POST_SERVICE) private readonly posts: IPostService) {}

  @Post()
  @PrivateRoute()
  create(@CurrentUser() user: JwtValidatedUser, @Body() dto: CreatePostDto) {
    return this.posts.create(user.id, dto);
  }

  @Get("feed/friends")
  @PrivateRoute()
  friendsFeed(
    @CurrentUser() user: JwtValidatedUser,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.posts.listFriendsFeed(
      user.id,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get()
  @PrivateRoute()
  list(@CurrentUser() user: JwtValidatedUser, @Query() query: ListPostsQueryDto) {
    const scopeId =
      query.scopeType === PostScopeType.GLOBAL_FEED ? null : query.scopeId ?? null;
    return this.posts.listByScope(user.id, query.scopeType, scopeId, query.page, query.limit);
  }

  @Delete(":id")
  @PrivateRoute()
  remove(@CurrentUser() user: JwtValidatedUser, @Param("id") id: string) {
    return this.posts.delete(user.id, id);
  }
}
