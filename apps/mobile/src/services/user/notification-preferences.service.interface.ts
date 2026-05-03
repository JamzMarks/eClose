import type {
  NotificationPreferencesDto,
  PatchNotificationPreferencesDto,
} from "@/contracts/notification-preferences.types";

export interface INotificationPreferencesService {
  get(): Promise<NotificationPreferencesDto>;
  patch(
    body: PatchNotificationPreferencesDto,
  ): Promise<NotificationPreferencesDto>;
}
