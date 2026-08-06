export function getLanguageHeader(request: Request): string {
  return request.headers.get("x-language") ?? "uk";
}
