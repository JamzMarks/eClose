import { ApiException } from "./http-error";

export type ClientErrorKind =
  | "network"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation"
  | "server"
  | "unknown";

export type NormalizedClientError = {
  kind: ClientErrorKind;
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};

function isNetworkError(e: unknown): boolean {
  return e instanceof TypeError && String(e.message).includes("fetch");
}

/**
 * Converte falhas de rede ou `ApiException` num formato estável para UI e serviços.
 */
export function normalizeHttpError(
  error: unknown,
  fallbackMessage = "Algo correu mal. Tenta novamente.",
): NormalizedClientError {
  if (isNetworkError(error)) {
    return {
      kind: "network",
      message: "Sem ligação ao servidor. Verifica a rede.",
    };
  }

  if (error instanceof ApiException) {
    const status = error.status;
    let kind: ClientErrorKind = "unknown";
    if (status === 401) kind = "unauthorized";
    else if (status === 403) kind = "forbidden";
    else if (status === 404) kind = "not_found";
    else if (status === 400 || status === 422) kind = "validation";
    else if (status >= 500) kind = "server";

    return {
      kind,
      message: error.message || fallbackMessage,
      status,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return { kind: "unknown", message: error.message || fallbackMessage };
  }

  return { kind: "unknown", message: fallbackMessage };
}
