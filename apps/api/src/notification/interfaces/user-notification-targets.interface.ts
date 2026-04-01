export type UserNotificationTargets = {
  email: string | null;
  phone: string | null;
  pushTokens: string[];
};

/**
 * Resolve destinos por usuário (implementação real virá do repositório de usuários / devices).
 */
export interface IUserNotificationTargets {
  resolve(userId: string): Promise<UserNotificationTargets>;
}
