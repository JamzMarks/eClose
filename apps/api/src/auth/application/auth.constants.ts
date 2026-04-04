/** Alinhar com JwtModule.register e JwtStrategy */
export const JWT_ACCESS_EXPIRES: string = process.env.JWT_ACCESS_EXPIRES ?? "15m";

export const JWT_SECRET = process.env.JWT_SECRET ?? "eclose-dev-change-me";

/** Token opaco enviado por e-mail (ou log em dev) para `POST /auth/email-verification/confirm`. */
export const JWT_EMAIL_VERIFY_EXPIRES: string =
  process.env.JWT_EMAIL_VERIFY_EXPIRES ?? "7d";

/** Claim `purpose` no payload JWT de verificação de e-mail. */
export const EMAIL_VERIFY_JWT_PURPOSE = "email_verify" as const;
