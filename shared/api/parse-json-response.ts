import { ApiError } from "./errors";

export async function parseJsonResponse<T>(response: Response): Promise<T> {
  if ([204, 205, 304].includes(response.status)) {
    return undefined as T;
  }

  const body: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof (body as { message: unknown }).message === "string"
        ? (body as { message: string }).message
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, body);
  }

  return body as T;
}
