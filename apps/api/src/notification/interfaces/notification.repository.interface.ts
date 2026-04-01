import { NotificationRecord } from "./notification-record.type";

export interface INotificationRepository {
  save(record: NotificationRecord): Promise<void>;
  listByUser(userId: string, limit?: number): Promise<NotificationRecord[]>;
}
