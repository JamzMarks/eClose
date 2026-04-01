import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationOrmEntity } from "@/notification/infrastructure/persistence/notification.orm-entity";
import { NotificationService } from "./notification.service";
import {
  EMAIL_CHANNEL,
  NOTIFICATION_REPOSITORY,
  NOTIFICATION_SERVICE,
  PUSH_CHANNEL,
  SMS_CHANNEL,
  USER_NOTIFICATION_TARGETS,
} from "./tokens/notification.tokens";
import { TypeormNotificationRepository } from "./infrastructure/typeorm-notification.repository";
import { StubUserNotificationTargets } from "./infrastructure/stub-user-notification-targets";
import { ConsoleEmailChannel } from "./infrastructure/console-email.channel";
import { ConsolePushChannel } from "./infrastructure/console-push.channel";
import { ConsoleSmsChannel } from "./infrastructure/console-sms.channel";

@Module({
  imports: [TypeOrmModule.forFeature([NotificationOrmEntity])],
  providers: [
    {
      provide: USER_NOTIFICATION_TARGETS,
      useClass: StubUserNotificationTargets,
    },
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: TypeormNotificationRepository,
    },
    {
      provide: EMAIL_CHANNEL,
      useClass: ConsoleEmailChannel,
    },
    {
      provide: PUSH_CHANNEL,
      useClass: ConsolePushChannel,
    },
    {
      provide: SMS_CHANNEL,
      useClass: ConsoleSmsChannel,
    },
    {
      provide: NOTIFICATION_SERVICE,
      useClass: NotificationService,
    },
  ],
  exports: [NOTIFICATION_SERVICE, USER_NOTIFICATION_TARGETS],
})
export class NotificationModule {}
