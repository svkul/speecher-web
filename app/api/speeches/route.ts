import { fetchBffUpstream } from "@/lib/api/server/bff-upstream";

export async function GET(request: Request) {
  const upstreamResponse = await fetchBffUpstream(request, "/speeches", {
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
