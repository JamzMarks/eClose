import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserOrmEntity } from "@/user/infrastructure/persistence/user.orm-entity";
import {
  IUserNotificationTargets,
  UserNotificationTargets,
} from "../interfaces/user-notification-targets.interface";

@Injectable()
export class TypeormUserNotificationTargets implements IUserNotificationTargets {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
  ) {}

  async resolve(userId: string): Promise<UserNotificationTargets> {
    const row = await this.users.findOne({ where: { id: userId } });
    if (!row) {
      return { email: null, phone: null, pushTokens: [] };
    }
    const tokens = Array.isArray(row.pushTokens) ? row.pushTokens.map(String) : [];
    return {
      email: row.email,
      phone: row.phone,
      pushTokens: tokens,
    };
  }
}
