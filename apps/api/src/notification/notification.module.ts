import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
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
import { TypeormUserNotificationTargets } from "./infrastructure/typeorm-user-notification-targets";
import { ConsoleEmailChannel } from "./infrastructure/console-email.channel";
import { ConsolePushChannel } from "./infrastructure/console-push.channel";
import { ConsoleSmsChannel } from "./infrastructure/console-sms.channel";
import { SmtpEmailChannel } from "./infrastructure/smtp-email.channel";
import { TwilioSmsChannel } from "./infrastructure/twilio-sms.channel";
import { FcmLegacyPushChannel } from "./infrastructure/fcm-legacy-push.channel";

function pickEmailChannel() {
  return process.env.SMTP_HOST ? SmtpEmailChannel : ConsoleEmailChannel;
}

function pickSmsChannel() {
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM
  ) {
    return TwilioSmsChannel;
  }
  return ConsoleSmsChannel;
}

function pickPushChannel() {
  return process.env.FCM_SERVER_KEY ? FcmLegacyPushChannel : ConsolePushChannel;
}

@Module({
  imports: [TypeOrmModule.forFeature([NotificationOrmEntity, UserOrmEntity])],
  providers: [
    {
      provide: USER_NOTIFICATION_TARGETS,
      useClass: TypeormUserNotificationTargets,
    },
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: TypeormNotificationRepository,
    },
    {
      provide: EMAIL_CHANNEL,
      useClass: pickEmailChannel(),
    },
    {
      provide: PUSH_CHANNEL,
      useClass: pickPushChannel(),
    },
    {
      provide: SMS_CHANNEL,
      useClass: pickSmsChannel(),
    },
    {
      provide: NOTIFICATION_SERVICE,
      useClass: NotificationService,
    },
  ],
  exports: [NOTIFICATION_SERVICE, USER_NOTIFICATION_TARGETS],
})
export class NotificationModule {}
