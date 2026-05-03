import { getApiClient } from "@/services/api-client";
import type { INotificationPreferencesService } from "@/services/user/notification-preferences.service.interface";
import type {
  NotificationPreferencesDto,
  PatchNotificationPreferencesDto,
} from "@/contracts/notification-preferences.types";

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
