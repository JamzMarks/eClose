import type { UserProfileResponse } from "@/contracts/auth.types";

/** Perfil autenticado; alinhado com `GET /auth/me` até existir `PATCH /users/me` genérico. */
export interface IUserService {
  getProfile(): Promise<UserProfileResponse>;
}
