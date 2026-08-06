import { fetchBffUpstream } from "@/lib/api/server/bff-upstream";

interface RouteContext {
  params: Promise<{ blockId: string }>;
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { blockId } = await params;

  const upstreamResponse = await fetchBffUpstream(
    request,
    `/speeches/blocks/${blockId}/audio`,
    {
      method: "DELETE",
    },
  );

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
