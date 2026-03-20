import { ApiException } from "./http-error";

type RequestMiddleware = (
  input: RequestInit
) => Promise<RequestInit> | RequestInit;

type ResponseMiddleware = (
  response: Response
) => Promise<Response> | Response;

const requestMiddlewares: RequestMiddleware[] = [];
const responseMiddlewares: ResponseMiddleware[] = [];

export function registerRequestMiddleware(mw: RequestMiddleware) {
  requestMiddlewares.push(mw);
}

export function registerResponseMiddleware(mw: ResponseMiddleware) {
  responseMiddlewares.push(mw);
}

export class HttpClient {
  constructor(
    private baseUrl: string,
    private requestMiddlewares: RequestMiddleware[] = [],
    private responseMiddlewares: ResponseMiddleware[] = []
  ) {}

    async request<T>(path: string, options?: RequestInit): Promise<T> {
        let config: RequestInit = {
            ...options,
            headers: {
            'Content-Type': 'application/json',
            ...(options?.headers || {}),
            },
        };

        // aplica request middlewares
        for (const mw of this.requestMiddlewares) {
            config = await mw(config);
        }

        let response = await fetch(`${this.baseUrl}${path}`, config);

        // aplica response middlewares
        for (const mw of this.responseMiddlewares) {
            response = await mw(response);
        }

        if (!response.ok) {
            const error = await response.json().catch(() => null);

            throw new ApiException({
                message: error?.message || 'Unexpected Error',
                status: response.status,
                code: error?.code,
                details: error?.details,
            });
        }   

        return response.json();
    }

    get<T>(path: string, options?: RequestInit) {
        return this.request<T>(path, {
            ...options,
            method: 'GET',
        });
    }

    post<T>(path: string, body?: any, options?: RequestInit) {
        return this.request<T>(path, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put<T>(path: string, body?: any, options?: RequestInit) {
        return this.request<T>(path, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    patch<T>(path: string, body?: any, options?: RequestInit) {
        return this.request<T>(path, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    delete<T>(path: string, options?: RequestInit) {
        return this.request<T>(path, {
            ...options,
            method: 'DELETE',
        });
    }
}