import { CommunicationChannel } from "../types/communication-channel.type";
import { NotificationStatus } from "../types/notification-status.type";
import { NotificationType } from "../types/notification.type";

export type NewNotificationProps = {
  id: string;
  userId: string;
  type: NotificationType;
  channel: CommunicationChannel;
  templateId?: string;
  templateVersion?: string;
  phoneNumber?: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

type NotificationState = NewNotificationProps & {
  status: NotificationStatus;
  createdAt: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  externalId?: string;
};

export class NotificationEntity {
    id: string;
    userId: string;
    type: NotificationType;
    channel: CommunicationChannel;

    templateId?: string;
    templateVersion?: string;
    phoneNumber?: string;

    title: string;
    body: string;
    data?: Record<string, unknown>;

    status: NotificationStatus;
    createdAt: Date;
    sentAt?: Date;
    deliveredAt?: Date;
    externalId?: string;

    private constructor(props: NotificationState) {
      Object.assign(this, props);
    }

    static create(props: NewNotificationProps): NotificationEntity {
  
      // regras gerais
      if (!props.userId) throw new Error('userId is required');
      if (!props.type) throw new Error('type is required');
      if (!props.channel) throw new Error('channel is required');
      if (!props.title) throw new Error('title is required');
      if (!props.body) throw new Error('body is required');
  
      // regras por canal
      if (props.channel === CommunicationChannel.SMS) {
        if (!props.phoneNumber) throw new Error("SMS requer phoneNumber");
      }
  
  
      return new NotificationEntity({
        ...props,
        status: NotificationStatus.PENDING,
        createdAt: new Date(),
      });
    }
  
    markAsSent(externalId?: string) {
      if (this.status !== NotificationStatus.PENDING) {
        throw new Error('Only pending notifications can be sent');
      }
  
      this.status = NotificationStatus.SENT;
      this.sentAt = new Date();
      this.externalId = externalId;
    }
  
    markAsDelivered() {
      if (this.status !== NotificationStatus.SENT) {
        throw new Error('Only sent notifications can be delivered');
      }
  
      this.status = NotificationStatus.DELIVERED;
      this.deliveredAt = new Date();
    }
  
    markAsFailed() {
      this.status = NotificationStatus.FAILED;
    }
  }