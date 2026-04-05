import { HttpClient } from "@/infrastructure/http/http-client";
import { getApiBaseUrl } from "@/infrastructure/http/api-config";

let singleton: HttpClient | null = null;

/** Cliente HTTP partilhado (middlewares de auth aplicados via setup). */
export function getApiClient(): HttpClient {
  if (!singleton) {
    singleton = new HttpClient(getApiBaseUrl());
  }
  return singleton;
}
