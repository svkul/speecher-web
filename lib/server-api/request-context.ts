import "server-only";
import { cookies } from "next/headers";
import { headers } from "next/headers";

interface ServerRequestContext {
  cookieHeader: string;
  host: string;
  proto: string;
  language: string;
}

export async function getServerRequestContext(): Promise<ServerRequestContext | null> {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const cookieHeader = cookieStore.toString();
  const host = requestHeaders.get("host");
  const proto = requestHeaders.get("x-forwarded-proto") ?? "http";
  const language = requestHeaders.get("x-language") ?? "uk";

  if (!cookieHeader || !host) {
    return null;
  }

  return {
    cookieHeader,
    host,
    proto,
    language,
  };
}
