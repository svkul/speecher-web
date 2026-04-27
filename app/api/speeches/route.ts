import { config } from "@/lib/config";
import { copySetCookieHeaders, getLanguageHeader } from "@/lib/api/client/bff";

export async function GET(request: Request) {
  const upstreamResponse = await fetch(`${config.apiBaseUrl}/speeches`, {
    method: "GET",
    headers: {
      "x-client-type": config.clientType,
      "x-language": getLanguageHeader(request),
      cookie: request.headers.get("cookie") ?? "",
    },
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
