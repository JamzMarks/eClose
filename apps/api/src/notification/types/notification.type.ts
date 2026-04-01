export enum NotificationType {
  FOLLOW = "FOLLOW",
  MESSAGE = "MESSAGE",
  REACTION = "REACTION",
  EVENT = "EVENT",
  EVENT_REMINDER = "EVENT_REMINDER",
  SYSTEM = "SYSTEM",
  UPDATES = "UPDATES",
  /** Códigos OTP / magic link — sempre opt-in e preferências de canal */
  VERIFICATION = "VERIFICATION",
  WELCOME = "WELCOME",
}