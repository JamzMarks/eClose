import { Expose } from "class-transformer";

/**
 * DTO legado; o contrato público de sessão é `GET /auth/me` (`auth/interface/http/dto/user-profile.dto`).
 */
export class UserProfileDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  username?: string | null;

  @Expose()
  firstName?: string | null;

  @Expose()
  lastName?: string | null;

  @Expose()
  phone?: string;

  @Expose()
  bio?: string;
}
