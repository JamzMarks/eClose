import { ApiException } from "./http-error";
import { forceLogoutSession, tryRefreshAccessToken } from "./auth-refresh";

function isAnonymousAuthPath(pathWithoutQuery: string): boolean {
  return (
    pathWithoutQuery === "/auth/sign-in" ||
    pathWithoutQuery === "/auth/sign-up" ||
    pathWithoutQuery === "/auth/refresh" ||
    pathWithoutQuery.startsWith("/auth/oauth/")
  );
}

type RequestMiddleware = (
  input: RequestInit,
) => Promise<RequestInit> | RequestInit;

type ResponseMiddleware = (
  response: Response,
) => Promise<Response> | Response;

const globalRequestMiddlewares: RequestMiddleware[] = [];
const globalResponseMiddlewares: ResponseMiddleware[] = [];

export function registerRequestMiddleware(mw: RequestMiddleware) {
  globalRequestMiddlewares.push(mw);
}

export function registerResponseMiddleware(mw: ResponseMiddleware) {
  globalResponseMiddlewares.push(mw);
}

async function parseJsonBody<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text.trim()) {
    return undefined as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiException({
      message: "Resposta inválida do servidor",
      status: response.status,
    });
  }
}

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  async request<T>(
    path: string,
    options?: RequestInit,
    is401Retry = false,
  ): Promise<T> {
    let config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    };

    const reqChain = [...globalRequestMiddlewares];
    for (const mw of reqChain) {
      config = await mw(config);
    }

    let response = await fetch(`${this.baseUrl}${path}`, config);

    const resChain = [...globalResponseMiddlewares];
    for (const mw of resChain) {
      response = await mw(response);
    }

    if (!response.ok) {
      const pathOnly = path.split("?")[0] ?? path;
      if (
        response.status === 401 &&
        !is401Retry &&
        !isAnonymousAuthPath(pathOnly)
      ) {
        const refreshed = await tryRefreshAccessToken();
        if (refreshed) {
          return this.request<T>(path, options, true);
        }
        await forceLogoutSession();
      }

      const raw = await response.text();
      type ErrJson = {
        message?: string | string[];
        code?: string;
        details?: unknown;
      };
      let errBody: ErrJson | null = null;
      if (raw.trim()) {
        try {
          errBody = JSON.parse(raw) as ErrJson;
        } catch {
          errBody = null;
        }
      }
      const msg = errBody?.message;
      const messageText = Array.isArray(msg)
        ? msg.join(", ")
        : (typeof msg === "string" ? msg : null);

      throw new ApiException({
        message: messageText ?? response.statusText ?? "Erro na API",
        status: response.status,
        code: errBody?.code,
        details: errBody?.details,
      });
    }

    return parseJsonBody<T>(response);
  }

  get<T>(path: string, options?: RequestInit) {
    return this.request<T>(path, { ...options, method: "GET" }, false);
  }

  post<T>(path: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(
      path,
      {
        ...options,
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      false,
    );
  }

  put<T>(path: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(
      path,
      {
        ...options,
        method: "PUT",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      false,
    );
  }

  patch<T>(path: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(
      path,
      {
        ...options,
        method: "PATCH",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      false,
    );
  }

  delete<T>(path: string, options?: RequestInit) {
    return this.request<T>(path, { ...options, method: "DELETE" }, false);
  }
}
