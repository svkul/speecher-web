import "server-only";

import { backendFetch } from "@/shared/api";
import type { SpeechListItemResponse } from "@/feature/speech/api/get-speeches";
import { getClerkSessionToken } from "@/shared/api/get-clerk-session-token";

export type ServerSpeechResponse = SpeechListItemResponse;

export const getSpeechesServer = async (): Promise<
  ServerSpeechResponse[] | null
> => {
  const token = await getClerkSessionToken();

  if (!token) {
    return null;
  }

  const response = await backendFetch("/speeches", {
    method: "GET",
    token,
    next: {
      tags: ["speeches"],
    },
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ServerSpeechResponse[];
};
