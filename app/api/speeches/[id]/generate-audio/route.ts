import { config } from "@/lib/config";
import { copySetCookieHeaders, getLanguageHeader } from "@/lib/auth/bff";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  const { id } = await params;

  const upstreamResponse = await fetch(
    `${config.apiBaseUrl}/speeches/${id}/generate-audio`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-client-type": config.clientType,
        "x-language": getLanguageHeader(request),
        cookie: request.headers.get("cookie") ?? "",
      },
      body: request.body ?? null,
      cache: "no-store",
    },
  );

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
