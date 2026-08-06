import { fetchBffUpstream } from "@/lib/api/server/bff-upstream";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  const { id } = await params;

  const upstreamResponse = await fetchBffUpstream(
    request,
    `/speeches/${id}/generate-audio`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: request.body ?? null,
    },
  );

  const responseBody = await upstreamResponse.text();

  return new Response(responseBody, {
    status: upstreamResponse.status,
    headers: {
      "content-type":
        upstreamResponse.headers.get("content-type") ?? "application/json",
    },
  });
}
