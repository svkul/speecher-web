import "server-only";

import { auth } from "@clerk/nextjs/server";

import { config } from "@/lib/config";

export async function getClerkSessionToken(): Promise<string | null> {
  const { getToken, isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return null;
  }

  return await getToken();
}

export async function backendFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const token = await getClerkSessionToken();
  const url = `${config.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("x-language", config.defaultLanguage);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...init,
    headers,
    cache: init?.cache ?? "no-store",
  });
}
