export type NotificationPreferencesDto = {
  email: boolean;
  push: boolean;
  sms: boolean;
};

export type PatchNotificationPreferencesDto = Partial<NotificationPreferencesDto>;
