/**
 * Contrato de geração de identificadores (agnóstico de framework).
 * Implementação global: UUID v7 (ordenável por tempo) em `ApplicationCoreModule`.
 */
export interface IdGenerator {
  generate(): string;
}

export const ID_GENERATOR = Symbol("ID_GENERATOR");
