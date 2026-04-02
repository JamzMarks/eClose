import { getApiClient } from "@/infrastructure/api/api-client";
import type { INotificationPreferencesService } from "@/infrastructure/api/user/notification-preferences.service.interface";
import type {
  NotificationPreferencesDto,
  PatchNotificationPreferencesDto,
} from "@/infrastructure/api/types/notification-preferences.types";

export class NotificationPreferencesService implements INotificationPreferencesService {
  private readonly client = getApiClient();

  get(): Promise<NotificationPreferencesDto> {
    return this.client.get<NotificationPreferencesDto>(
      "/users/me/notification-preferences",
    );
  }

  patch(
    body: PatchNotificationPreferencesDto,
  ): Promise<NotificationPreferencesDto> {
    return this.client.patch<NotificationPreferencesDto>(
      "/users/me/notification-preferences",
      body,
    );
  }
}
