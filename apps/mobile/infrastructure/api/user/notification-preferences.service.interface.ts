import type {
  NotificationPreferencesDto,
  PatchNotificationPreferencesDto,
} from "@/infrastructure/api/types/notification-preferences.types";

export interface INotificationPreferencesService {
  get(): Promise<NotificationPreferencesDto>;
  patch(
    body: PatchNotificationPreferencesDto,
  ): Promise<NotificationPreferencesDto>;
}
