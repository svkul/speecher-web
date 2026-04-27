import { config } from "@/lib/config";
import { copySetCookieHeaders, getLanguageHeader } from "@/lib/api/client/bff";

interface RouteContext {
  params: Promise<{ blockId: string }>;
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { blockId } = await params;

  const upstreamResponse = await fetch(
    `${config.apiBaseUrl}/speeches/blocks/${blockId}/audio`,
    {
      method: "DELETE",
      headers: {
        "x-client-type": config.clientType,
        "x-language": getLanguageHeader(request),
        cookie: request.headers.get("cookie") ?? "",
      },
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
