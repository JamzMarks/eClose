export class ResourceNotFoundError extends Error {
  readonly code = "NOT_FOUND" as const;

  constructor(message = "Recurso não encontrado") {
    super(message);
    this.name = "ResourceNotFoundError";
  }
}
