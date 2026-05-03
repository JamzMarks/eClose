export type ApiPaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

/**
 * Envelope global de resposta da API (pensado para evolução).
 *
 * Hoje o app consome `T` diretamente (sem envelope). Estes tipos servem para:
 * - orientar mocks
 * - permitir migração suave futura para `{ data, meta }`
 */
export type ApiMeta = {
  requestId?: string;
  timestamp?: string;
  version?: string;
  pagination?: ApiPaginationMeta;
  warnings?: { code: string; message: string }[];
};

export type ApiEnvelope<T> = {
  data: T;
  meta?: ApiMeta;
};

export type ApiErrorEnvelope = {
  error: { message: string; code?: string; details?: unknown };
  meta?: ApiMeta;
};
