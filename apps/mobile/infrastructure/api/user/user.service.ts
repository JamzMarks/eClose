import { getApiClient } from "@/infrastructure/api/api-client";
import type { IUserService } from "@/infrastructure/api/user/user.service.interface";
import type { UserProfileResponse } from "@/infrastructure/api/types/auth.types";

export class UserService implements IUserService {
  private readonly client = getApiClient();

  getProfile(): Promise<UserProfileResponse> {
    return this.client.get<UserProfileResponse>("/auth/me");
  }
}
