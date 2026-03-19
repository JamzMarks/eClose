

export interface INotificationService {

    // envio direto (casos específicos)
    sendNotification(dto: SendNotificationDto): Promise<void>;
  
    // envio baseado em evento de domínio
    handleEvent(event: DomainEvent): Promise<void>;
  
    // canais
    sendPush(userId: string, payload: PushPayload): Promise<void>;
    sendEmail(userId: string, payload: EmailPayload): Promise<void>;
  
    // preferências
    shouldNotify(userId: string, type: NotificationType): Promise<boolean>;
  
  }