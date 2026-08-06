import "server-only";

import { auth } from "@clerk/nextjs/server";

import { config } from "@/lib/config";
import { getLanguageHeader } from "@/lib/api/client/bff";

export async function buildBffUpstreamHeaders(
  request: Request,
): Promise<Headers> {
  const { getToken, isAuthenticated } = await auth();
  const token = isAuthenticated ? await getToken() : null;

  const headers = new Headers();
  headers.set("x-language", getLanguageHeader(request));

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

export async function fetchBffUpstream(
  request: Request,
  path: string,
  init?: Omit<RequestInit, "headers"> & { headers?: HeadersInit },
): Promise<Response> {
  const upstreamHeaders = await buildBffUpstreamHeaders(request);
  const extraHeaders = new Headers(init?.headers);

  for (const [key, value] of extraHeaders.entries()) {
    upstreamHeaders.set(key, value);
  }

  const url = `${config.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  return fetch(url, {
    ...init,
    headers: upstreamHeaders,
    cache: "no-store",
  });
}
