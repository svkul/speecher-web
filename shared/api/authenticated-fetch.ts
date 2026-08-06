import { config } from "@/lib/config";

import { getBackendUrl } from "./config";
import { ApiError } from "./errors";

type AuthenticatedFetchOptions = Omit<RequestInit, "headers"> & {
  token: string | null;
  headers?: HeadersInit;
};

export async function authenticatedFetch(
  path: string,
  { token, headers, ...init }: AuthenticatedFetchOptions,
): Promise<Response> {
  if (!token) {
    throw new ApiError("Not authenticated", 401);
  }

  const url = `${getBackendUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-language": config.defaultLanguage,
      Authorization: `Bearer ${token}`,
      ...headers,
    },
  });
}
