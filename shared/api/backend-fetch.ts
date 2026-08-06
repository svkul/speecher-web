import { config } from "@/lib/config";

import { getBackendUrl } from "./config";
import { parseJsonResponse } from "./parse-json-response";

export type BackendFetchOptions = {
  token?: string | null;
  method?: RequestInit["method"];
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function backendFetch(
  path: string,
  options: BackendFetchOptions = {},
): Promise<Response> {
  const url = `${getBackendUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(options.headers);
  headers.set("x-language", config.defaultLanguage);

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  return fetch(url, {
    method: options.method ?? "GET",
    headers,
    body:
      options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    next: options.next,
  });
}

export async function backendJson<T>(
  path: string,
  options: BackendFetchOptions = {},
): Promise<T> {
  const response = await backendFetch(path, options);
  return parseJsonResponse<T>(response);
}
