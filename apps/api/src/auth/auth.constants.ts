/** Alinhar com JwtModule.register e JwtStrategy */
export const JWT_ACCESS_EXPIRES: string = process.env.JWT_ACCESS_EXPIRES ?? "15m";

export const JWT_SECRET = process.env.JWT_SECRET ?? "eclose-dev-change-me";
