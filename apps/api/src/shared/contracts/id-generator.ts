/**
 * Contrato de geração de identificadores (agnóstico de framework).
 */
export interface IdGenerator {
  generate(): string;
}

export const ID_GENERATOR = Symbol("ID_GENERATOR");
