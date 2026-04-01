import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import { NotificationEntity } from "@/notification/entity/notification.entity";
import { SendNotificationDto } from "@/notification/dto/send-notification.dto";
import { CommunicationChannel } from "@/notification/types/communication-channel.type";
import { DomainEventName } from "@/notification/types/domain-event-names";
import { NotificationType } from "@/notification/types/notification.type";
import { DomainEvent } from "@/notification/types/domain-event.type";
import {
  EmailPayload,
  PushPayload,
  SmsPayload,
} from "@/notification/types/notification-payloads.type";
import { INotificationService } from "@/notification/interfaces/notification.interface";
import { NotificationRecord } from "@/notification/interfaces/notification-record.type";
import {
  IUserNotificationTargets,
  UserNotificationTargets,
} from "@/notification/interfaces/user-notification-targets.interface";
import { INotificationRepository } from "@/notification/interfaces/notification.repository.interface";
import { IEmailChannel } from "@/notification/interfaces/email-channel.interface";
import { IPushChannel } from "@/notification/interfaces/push-channel.interface";
import { ISmsChannel } from "@/notification/interfaces/sms-channel.interface";
import {
  EMAIL_CHANNEL,
  NOTIFICATION_REPOSITORY,
  PUSH_CHANNEL,
  SMS_CHANNEL,
  USER_NOTIFICATION_TARGETS,
} from "@/notification/tokens/notification.tokens";

type ChannelPrefs = { email: boolean; push: boolean; sms: boolean };

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
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
  ) {}

  private async loadPrefs(userId: string): Promise<ChannelPrefs> {
    const row = await this.users.findOne({ where: { id: userId } });
    const p = row?.notificationPreferences;
    if (!p) return { email: true, push: true, sms: true };
    return {
      email: p.email !== false,
      push: p.push !== false,
      sms: p.sms !== false,
    };
  }

  async shouldNotify(userId: string, type: NotificationType): Promise<boolean> {
    const prefs = await this.loadPrefs(userId);
    if (!prefs.email && !prefs.push && !prefs.sms) return false;
    if (type === NotificationType.VERIFICATION) {
      return prefs.email || prefs.sms;
    }
    return true;
  }

  async sendNotification(dto: SendNotificationDto): Promise<void> {
    if (!(await this.shouldNotify(dto.userId, dto.type))) return;

    const t = await this.targets.resolve(dto.userId);
    const prefs = await this.loadPrefs(dto.userId);
    const preferred = this.resolveChannel(dto, t);
    const channel = this.pickAllowedChannel(preferred, prefs, t, dto);
    if (!channel) {
      this.log.warn(`Sem canal disponível ou consentimento (userId=${dto.userId})`);
      return;
    }

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
    const notifyUserId = event.payload?.notifyUserId as string | undefined;
    if (!notifyUserId) {
      this.log.debug(`Sem destinatário para evento ${event.name}`);
      return;
    }

    switch (event.name) {
      case DomainEventName.BOOKING_INQUIRY_CREATED:
        await this.sendNotification({
          userId: notifyUserId,
          type: NotificationType.BOOKING_INQUIRY,
          title: "Novo pedido de booking",
          body: "Recebeu um novo pedido de booking na eClose.",
        });
        break;
      case DomainEventName.BOOKING_DATES_PROPOSED:
        await this.sendNotification({
          userId: notifyUserId,
          type: NotificationType.BOOKING_NEGOTIATION,
          title: "Novas datas propostas",
          body: "A contraparte propôs novas datas para o booking.",
        });
        break;
      case DomainEventName.BOOKING_DATES_CONFIRMED:
        await this.sendNotification({
          userId: notifyUserId,
          type: NotificationType.BOOKING_DATES_CONFIRMED,
          title: "Datas confirmadas pelo solicitante",
          body: "O solicitante confirmou datas no calendário. Pode aceitar o booking.",
        });
        break;
      case DomainEventName.BOOKING_CONFIRMED:
        await this.sendNotification({
          userId: notifyUserId,
          type: NotificationType.BOOKING_CONFIRMED,
          title: "Booking confirmado",
          body: "A contraparte confirmou o booking.",
        });
        break;
      case DomainEventName.BOOKING_DECLINED:
        await this.sendNotification({
          userId: notifyUserId,
          type: NotificationType.BOOKING_DECLINED,
          title: "Booking recusado",
          body: "A contraparte recusou este pedido de booking.",
        });
        break;
      case DomainEventName.BOOKING_CANCELLED:
        await this.sendNotification({
          userId: notifyUserId,
          type: NotificationType.BOOKING_CANCELLED,
          title: "Booking cancelado",
          body: "O solicitante cancelou o pedido de booking.",
        });
        break;
      case DomainEventName.EVENT_PUBLISHED:
        await this.sendNotification({
          userId: notifyUserId,
          type: NotificationType.EVENT_PUBLISHED,
          title: "Evento publicado",
          body: "Um evento que segue foi publicado na eClose.",
        });
        break;
      default:
        this.log.debug(`Evento de domínio sem handler: ${event.name}`);
    }
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

  private pickAllowedChannel(
    preferred: CommunicationChannel,
    prefs: ChannelPrefs,
    t: UserNotificationTargets,
    dto: SendNotificationDto,
  ): CommunicationChannel | null {
    const order: CommunicationChannel[] = [
      preferred,
      CommunicationChannel.EMAIL,
      CommunicationChannel.PUSH_NOTIFICATION,
      CommunicationChannel.SMS,
    ];
    const seen = new Set<CommunicationChannel>();
    const candidates = order.filter((c) => {
      if (seen.has(c)) return false;
      seen.add(c);
      return true;
    });

    const email = dto.toEmail ?? t.email;
    const phone = dto.toPhone ?? t.phone;
    const push = [...(dto.pushTokens ?? []), ...t.pushTokens];

    for (const ch of candidates) {
      if (ch === CommunicationChannel.EMAIL && prefs.email && email) return ch;
      if (ch === CommunicationChannel.SMS && prefs.sms && phone) return ch;
      if (ch === CommunicationChannel.PUSH_NOTIFICATION && prefs.push && push.length > 0) return ch;
    }
    return null;
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
