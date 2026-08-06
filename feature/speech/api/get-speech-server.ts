import "server-only";

import { backendFetch } from "@/shared/api";
import type {
  SpeechBlockResponse,
  SpeechDetailResponse,
} from "@/feature/speech/api/get-speech";
import { getClerkSessionToken } from "@/shared/api/get-clerk-session-token";

export type ServerSpeechBlockResponse = SpeechBlockResponse;
export type ServerSpeechDetailResponse = SpeechDetailResponse;

export const getSpeechServer = async (
  id: string,
): Promise<ServerSpeechDetailResponse | null> => {
  const token = await getClerkSessionToken();

  if (!token) {
    return null;
  }

  const response = await backendFetch(`/speeches/${id}`, {
    method: "GET",
    token,
    next: {
      tags: [`speech-${id}`],
    },
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ServerSpeechDetailResponse;
};
