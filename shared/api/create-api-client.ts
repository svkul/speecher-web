import { authenticatedFetch } from "./authenticated-fetch";
import { parseJsonResponse } from "./parse-json-response";

export type GetToken = (options?: {
  template?: string;
}) => Promise<string | null>;

type RequestOptions = Omit<RequestInit, "method" | "body">;

export function createApiClient(getToken: GetToken) {
  const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const token = await getToken();
    const response = await authenticatedFetch(path, { token, ...init });
    return parseJsonResponse<T>(response);
  };

  return {
    get<T>(path: string, options?: RequestOptions): Promise<T> {
      return request<T>(path, { ...options, method: "GET" });
    },

    post<T>(
      path: string,
      body?: unknown,
      options?: RequestOptions,
    ): Promise<T> {
      return request<T>(path, {
        ...options,
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    },

    patch<T>(
      path: string,
      body?: unknown,
      options?: RequestOptions,
    ): Promise<T> {
      return request<T>(path, {
        ...options,
        method: "PATCH",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    },

    delete<T>(path: string, options?: RequestOptions): Promise<T> {
      return request<T>(path, { ...options, method: "DELETE" });
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
