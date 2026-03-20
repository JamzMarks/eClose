import { CommunicationChannel } from "../types/communication-channel.type";
import { NotificationStatus } from "../types/notification-status.type";
import { NotificationType } from "../types/notification.type";

export interface NotificationRecord {
    id: string;
    userId: string;
    type: NotificationType;
    channel: CommunicationChannel;
    templateId?: string;
    templateVersion?: string;
    payload: Record<string, any>;
    status: NotificationStatus;
    createdAt: Date;
    sentAt?: Date;
    deliveredAt?: Date;
    externalId?: string;
}