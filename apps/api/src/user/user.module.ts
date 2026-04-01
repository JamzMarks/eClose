import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { NotificationModule } from "@/notification/notification.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity]), NotificationModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
