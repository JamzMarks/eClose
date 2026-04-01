import { Injectable } from "@nestjs/common";
import {
  IUserNotificationTargets,
  UserNotificationTargets,
} from "../interfaces/user-notification-targets.interface";

@Injectable()
export class StubUserNotificationTargets implements IUserNotificationTargets {
  async resolve(_userId: string): Promise<UserNotificationTargets> {
    return { email: null, phone: null, pushTokens: [] };
  }
}
