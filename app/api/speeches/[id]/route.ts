import { fetchBffUpstream } from "@/lib/api/server/bff-upstream";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;

  const upstreamResponse = await fetchBffUpstream(request, `/speeches/${id}`, {
    method: "GET",
  });

  const responseBody = await upstreamResponse.text();

  return new Response(responseBody, {
    status: upstreamResponse.status,
    headers: {
      "content-type":
        upstreamResponse.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;

  const upstreamResponse = await fetchBffUpstream(request, `/speeches/${id}`, {
    method: "DELETE",
  });

  if ([204, 205, 304].includes(upstreamResponse.status)) {
    return new Response(null, { status: upstreamResponse.status });
  }

  return new Response(await upstreamResponse.text(), {
    status: upstreamResponse.status,
    headers: {
      "content-type":
        upstreamResponse.headers.get("content-type") ?? "application/json",
    },
  });
}
