import "server-only";

import { backendFetch } from "@/shared/api";
import type { TtsLanguagesResponse } from "@/feature/speech/api/get-tts-languages";
import { getClerkSessionToken } from "@/shared/api/get-clerk-session-token";

export async function getTtsLanguagesServer(): Promise<TtsLanguagesResponse | null> {
  const token = await getClerkSessionToken();

  if (!token) {
    return null;
  }

  const response = await backendFetch("/speeches/tts/languages", {
    method: "GET",
    token,
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as TtsLanguagesResponse;
}
