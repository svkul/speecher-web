export function copySetCookieHeaders(upstreamHeaders: Headers, response: Response) {
  const getSetCookie = (
    upstreamHeaders as Headers & { getSetCookie?: () => string[] }
  ).getSetCookie;

  if (getSetCookie) {
    const cookies = getSetCookie.call(upstreamHeaders);
    for (const cookie of cookies) {
      response.headers.append("set-cookie", cookie);
    }
    return;
  }

  const setCookie = upstreamHeaders.get("set-cookie");
  if (setCookie) {
    response.headers.append("set-cookie", setCookie);
  }
}

export function getLanguageHeader(request: Request): string {
  return request.headers.get("x-language") ?? "uk";
}
