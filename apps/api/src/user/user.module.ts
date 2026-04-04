import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { ArtistModule } from "@/artist/artist.module";
import { VenueModule } from "@/venue/venue.module";
import { NotificationModule } from "@/notification/notification.module";
import { UserController } from "./interface/http/user.controller";
import { UserService } from "./application/user.service";
import { USER_SERVICE } from "./application/tokens/user.tokens";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    NotificationModule,
    ArtistModule,
    VenueModule,
  ],
  controllers: [UserController],
  providers: [{ provide: USER_SERVICE, useClass: UserService }],
  exports: [USER_SERVICE],
})
export class UserModule {}
