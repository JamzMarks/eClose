/** Erro de domínio para violações de autorização (sem dependência de HTTP). */
export class AccessDeniedError extends Error {
  readonly code = "ACCESS_DENIED" as const;

  constructor(message = "Acesso negado") {
    super(message);
    this.name = "AccessDeniedError";
  }
}
