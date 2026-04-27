import { config } from "@/lib/config";
import { copySetCookieHeaders, getLanguageHeader } from "@/lib/api/client/bff";

export async function POST(request: Request) {
  const upstreamResponse = await fetch(`${config.apiBaseUrl}/auth/signout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": config.clientType,
      "x-language": getLanguageHeader(request),
      cookie: request.headers.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  const response = new Response(null, {
    status: upstreamResponse.status,
  });

  copySetCookieHeaders(upstreamResponse.headers, response);

  return response;
}
