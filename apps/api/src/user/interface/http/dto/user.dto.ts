import { Expose } from "class-transformer";

/**
 * DTO de leitura alinhado às colunas persistidas em `users` (uso interno / futuros mapeamentos).
 * Não exposto diretamente por rotas HTTP neste módulo.
 */
export class UserDto {
  @Expose()
  id!: string;

  @Expose()
  username!: string | null;

  @Expose()
  firstName!: string | null;

  @Expose()
  lastName!: string | null;

  @Expose()
  bio?: string | null;
}
