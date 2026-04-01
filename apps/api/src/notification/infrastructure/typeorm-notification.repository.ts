import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationOrmEntity } from "@/notification/infrastructure/persistence/notification.orm-entity";
import { INotificationRepository } from "../interfaces/notification.repository.interface";
import { NotificationRecord } from "../interfaces/notification-record.type";
import { CommunicationChannel } from "../types/communication-channel.type";
import { NotificationStatus } from "../types/notification-status.type";
import { NotificationType } from "../types/notification.type";

@Injectable()
export class TypeormNotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly repo: Repository<NotificationOrmEntity>,
  ) {}

  async save(record: NotificationRecord): Promise<void> {
    await this.repo.save(this.toRow(record));
  }

  async listByUser(userId: string, limit = 50): Promise<NotificationRecord[]> {
    const rows = await this.repo.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
    });
    return rows.reverse().map((r) => this.toDomain(r));
  }

  private toRow(r: NotificationRecord): NotificationOrmEntity {
    const row = new NotificationOrmEntity();
    row.id = r.id;
    row.userId = r.userId;
    row.type = r.type;
    row.channel = r.channel;
    row.templateId = r.templateId ?? null;
    row.templateVersion = r.templateVersion ?? null;
    row.payload = r.payload ?? {};
    row.status = r.status;
    row.createdAt = r.createdAt;
    row.sentAt = r.sentAt ?? null;
    row.deliveredAt = r.deliveredAt ?? null;
    row.externalId = r.externalId ?? null;
    return row;
  }

  private toDomain(row: NotificationOrmEntity): NotificationRecord {
    return {
      id: row.id,
      userId: row.userId,
      type: row.type as NotificationType,
      channel: row.channel as CommunicationChannel,
      templateId: row.templateId ?? undefined,
      templateVersion: row.templateVersion ?? undefined,
      payload: row.payload ?? {},
      status: row.status as NotificationStatus,
      createdAt: row.createdAt,
      sentAt: row.sentAt ?? undefined,
      deliveredAt: row.deliveredAt ?? undefined,
      externalId: row.externalId ?? undefined,
    };
  }
}
