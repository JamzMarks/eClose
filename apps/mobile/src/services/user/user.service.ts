import { getApiClient } from "@/services/api-client";
import { USE_API_MOCKS } from "@/services/config/api-mocks";
import type { IUserService } from "@/services/user/user.service.interface";
import type { UserProfileResponse } from "@/services/types/auth.types";

export class UserService implements IUserService {
  private readonly client = getApiClient();

  getProfile(): Promise<UserProfileResponse> {
    if (USE_API_MOCKS) {
      return Promise.resolve({
        id: "user_mock_1",
        email: "mock@eclose.app",
        username: "mock_user",
        firstName: "Mock",
        lastName: "User",
        profileNamesAcknowledgedAt: new Date().toISOString(),
        emailVerifiedAt: new Date().toISOString(),
        needsEmailVerification: false,
        needsProfileNames: false,
        needsEventInterests: false,
        profileCompletion: "full",
      });
    }

    // return this.client.get<UserProfileResponse>("/auth/me");
    return this.client.get<UserProfileResponse>("/auth/me");
  }
}
