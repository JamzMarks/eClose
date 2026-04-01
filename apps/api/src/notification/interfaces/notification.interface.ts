import { SendNotificationDto } from "../dto/send-notification.dto";
import { NotificationType } from "../types/notification.type";
import { NotificationRecord } from "./notification-record.type";
import { DomainEvent } from "../types/domain-event.type";
import {
  EmailPayload,
  PushPayload,
  SmsPayload,
} from "../types/notification-payloads.type";

/**
 * Orquestrador único de envio: política, preferências, persistência e despacho por canal.
 * Centralizar aqui é adequado no MVP (um lugar para idempotência, auditoria e consentimento).
 * Evoluir: filas (SQS/Bull), outbox, ou workers por canal — mantendo esta interface como fachada.
 */
export interface INotificationService {
  sendNotification(dto: SendNotificationDto): Promise<void>;

  handleEvent(event: DomainEvent): Promise<void>;

  sendPush(userId: string, payload: PushPayload): Promise<void>;

  sendEmail(userId: string, payload: EmailPayload): Promise<void>;

  sendSms(userId: string, payload: SmsPayload): Promise<void>;

  shouldNotify(userId: string, type: NotificationType): Promise<boolean>;

  persistNotification(record: NotificationRecord): Promise<void>;
}
