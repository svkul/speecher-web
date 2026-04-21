import { config } from "@/lib/config";
import { copySetCookieHeaders, getLanguageHeader } from "@/lib/auth/bff";

export async function POST(request: Request) {
  const body = await request.text();

  const upstreamResponse = await fetch(`${config.apiBaseUrl}/auth/oauth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": config.clientType,
      "x-language": getLanguageHeader(request),
      cookie: request.headers.get("cookie") ?? "",
    },
    body,
    cache: "no-store",
  });

  const responseBody = await upstreamResponse.text();

  const response = new Response(responseBody, {
    status: upstreamResponse.status,
    headers: {
      "content-type":
        upstreamResponse.headers.get("content-type") ?? "application/json",
    },
  });

  copySetCookieHeaders(upstreamResponse.headers, response);

  return response;
}
