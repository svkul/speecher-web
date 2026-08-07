import "server-only";

import { backendFetch } from "@/shared/api";
import type { TtsModelsResponse } from "@/feature/speech/api/get-tts-models";
import { getClerkSessionToken } from "@/shared/api/get-clerk-session-token";

export async function getTtsModelsServer(): Promise<TtsModelsResponse | null> {
  const token = await getClerkSessionToken();

  if (!token) {
    return null;
  }

  const response = await backendFetch("/speeches/tts/models", {
    method: "GET",
    token,
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as TtsModelsResponse;
}
