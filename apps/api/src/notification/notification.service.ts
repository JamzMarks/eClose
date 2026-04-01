import { Inject, Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import { NotificationEntity } from "./entity/notification.entity";
import { SendNotificationDto } from "./dto/send-notification.dto";
import { CommunicationChannel } from "./types/communication-channel.type";
import { NotificationType } from "./types/notification.type";
import { DomainEvent } from "./types/domain-event.type";
import {
  EmailPayload,
  PushPayload,
  SmsPayload,
} from "./types/notification-payloads.type";
import { INotificationService } from "./interfaces/notification.interface";
import { NotificationRecord } from "./interfaces/notification-record.type";
import {
  IUserNotificationTargets,
  UserNotificationTargets,
} from "./interfaces/user-notification-targets.interface";
import { INotificationRepository } from "./interfaces/notification.repository.interface";
import { IEmailChannel } from "./interfaces/email-channel.interface";
import { IPushChannel } from "./interfaces/push-channel.interface";
import { ISmsChannel } from "./interfaces/sms-channel.interface";
import {
  EMAIL_CHANNEL,
  NOTIFICATION_REPOSITORY,
  PUSH_CHANNEL,
  SMS_CHANNEL,
  USER_NOTIFICATION_TARGETS,
} from "./tokens/notification.tokens";

@Injectable()
export class NotificationService implements INotificationService {
  private readonly log = new Logger(NotificationService.name);

  constructor(
    @Inject(USER_NOTIFICATION_TARGETS)
    private readonly targets: IUserNotificationTargets,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: INotificationRepository,
    @Inject(EMAIL_CHANNEL)
    private readonly emailChannel: IEmailChannel,
    @Inject(PUSH_CHANNEL)
    private readonly pushChannel: IPushChannel,
    @Inject(SMS_CHANNEL)
    private readonly smsChannel: ISmsChannel,
  ) {}

  async shouldNotify(_userId: string, _type: NotificationType): Promise<boolean> {
    // MVP: consentimento fino e preferências por canal virão do perfil / LGPD
    return true;
  }

  async sendNotification(dto: SendNotificationDto): Promise<void> {
    if (!(await this.shouldNotify(dto.userId, dto.type))) return;

    const t = await this.targets.resolve(dto.userId);
    const channel = this.resolveChannel(dto, t);
    const email = dto.toEmail ?? t.email ?? undefined;
    const phone = dto.toPhone ?? t.phone ?? undefined;
    const pushTokens = [...(dto.pushTokens ?? []), ...t.pushTokens];

    if (channel === CommunicationChannel.EMAIL && !email) {
      this.log.warn(`Notificação sem e-mail (userId=${dto.userId})`);
      return;
    }
    if (channel === CommunicationChannel.SMS && !phone) {
      this.log.warn(`Notificação sem telefone (userId=${dto.userId})`);
      return;
    }
    if (channel === CommunicationChannel.PUSH_NOTIFICATION && pushTokens.length === 0) {
      this.log.warn(`Notificação sem tokens push (userId=${dto.userId})`);
      return;
    }

    const entity = NotificationEntity.create({
      id: randomUUID(),
      userId: dto.userId,
      type: dto.type,
      channel,
      templateId: dto.templateId,
      templateVersion: dto.templateVersion,
      phoneNumber: phone,
      title: dto.title,
      body: dto.body,
      data: dto.data,
    });

    try {
      let externalId: string | undefined;
      if (channel === CommunicationChannel.EMAIL) {
        const r = await this.emailChannel.send({
          to: email!,
          subject: dto.title,
          textBody: dto.body,
          htmlBody: dto.htmlBody,
          templateId: dto.templateId,
          templateVersion: dto.templateVersion,
        });
        externalId = r.externalId;
      } else if (channel === CommunicationChannel.SMS) {
        const r = await this.smsChannel.send({ to: phone!, body: dto.body });
        externalId = r.externalId;
      } else {
        const r = await this.pushChannel.send({
          tokens: pushTokens,
          title: dto.title,
          body: dto.body,
          data: dto.data as Record<string, string> | undefined,
        });
        externalId = r.externalId;
      }
      entity.markAsSent(externalId);
    } catch (err) {
      entity.markAsFailed();
      this.log.error("Falha ao enviar notificação", err);
    }

    await this.persistFromEntity(entity);
  }

  async handleEvent(event: DomainEvent): Promise<void> {
    this.log.debug(`Evento de domínio (fila futura): ${event.name} ${event.aggregateId}`);
  }

  async sendPush(userId: string, payload: PushPayload): Promise<void> {
    await this.sendNotification({
      userId,
      type: NotificationType.SYSTEM,
      title: payload.title,
      body: payload.body,
      data: payload.data,
      channel: CommunicationChannel.PUSH_NOTIFICATION,
    });
  }

  async sendEmail(userId: string, payload: EmailPayload): Promise<void> {
    await this.sendNotification({
      userId,
      type: NotificationType.SYSTEM,
      title: payload.subject,
      body: payload.body,
      htmlBody: payload.htmlBody,
      channel: CommunicationChannel.EMAIL,
      templateId: payload.templateId,
      templateVersion: payload.templateVersion,
    });
  }

  async sendSms(userId: string, payload: SmsPayload): Promise<void> {
    await this.sendNotification({
      userId,
      type: NotificationType.SYSTEM,
      title: "SMS",
      body: payload.body,
      channel: CommunicationChannel.SMS,
    });
  }

  async persistNotification(record: NotificationRecord): Promise<void> {
    await this.repository.save(record);
  }

  private resolveChannel(
    dto: SendNotificationDto,
    t: UserNotificationTargets,
  ): CommunicationChannel {
    if (dto.channel) return dto.channel;
    if (dto.toEmail || t.email) return CommunicationChannel.EMAIL;
    if (dto.toPhone || t.phone) return CommunicationChannel.SMS;
    if ((dto.pushTokens?.length ?? 0) > 0 || t.pushTokens.length > 0) {
      return CommunicationChannel.PUSH_NOTIFICATION;
    }
    return CommunicationChannel.EMAIL;
  }

  private async persistFromEntity(entity: NotificationEntity): Promise<void> {
    const record: NotificationRecord = {
      id: entity.id,
      userId: entity.userId,
      type: entity.type,
      channel: entity.channel,
      templateId: entity.templateId,
      templateVersion: entity.templateVersion,
      payload: {
        title: entity.title,
        body: entity.body,
        data: entity.data,
      },
      status: entity.status,
      createdAt: entity.createdAt,
      sentAt: entity.sentAt,
      deliveredAt: entity.deliveredAt,
      externalId: entity.externalId,
    };
    await this.repository.save(record);
  }
}
