import { getApiClient } from "@/services/api-client";
import { LOCAL_USER_PROFILE } from "@/services/auth/auth.local-data";
import { USE_LOCAL_SERVICE_DATA } from "@/services/config/service-data-source";
import type { IUserService } from "@/services/user/user.service.interface";
import type { UserProfileResponse } from "@/contracts/auth.types";

export class UserService implements IUserService {
  private readonly client = getApiClient();

  getProfile(): Promise<UserProfileResponse> {
    if (USE_LOCAL_SERVICE_DATA) {
      return Promise.resolve(LOCAL_USER_PROFILE);
    }
    return this.client.get<UserProfileResponse>("/auth/me");
  }
}
