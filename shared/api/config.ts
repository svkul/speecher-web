export function getBackendUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!url) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured");
  }

  return url.replace(/\/$/, "");
}
