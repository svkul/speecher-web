import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { headers } from "next/headers";

export interface ServerUserResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  language: string | null;
  trialUsed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getCurrentUserServer = cache(
  async (): Promise<ServerUserResponse | null> => {
    const cookieStore = await cookies();
    const requestHeaders = await headers();
    const cookieHeader = cookieStore.toString();
    const host = requestHeaders.get("host");
    const proto = requestHeaders.get("x-forwarded-proto") ?? "http";

    if (!cookieHeader || !host) {
      return null;
    }

    const response = await fetch(`${proto}://${host}/api/user/me`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
        "x-language": "uk",
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ServerUserResponse;
  },
);
