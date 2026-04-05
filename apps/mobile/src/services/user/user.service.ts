import { getApiClient } from "@/services/api-client";
import type { IUserService } from "@/services/user/user.service.interface";
import type { UserProfileResponse } from "@/services/types/auth.types";

export class UserService implements IUserService {
  private readonly client = getApiClient();

  getProfile(): Promise<UserProfileResponse> {
    return this.client.get<UserProfileResponse>("/auth/me");
  }
}
