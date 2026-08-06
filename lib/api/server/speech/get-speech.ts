import "server-only";

import { backendFetch } from "../backend-fetch";

export interface ServerSpeechBlockResponse {
  id: string;
  order: number;
  title: string;
  text: string;
  audioUrl: string | null;
  lines: {
    line: number;
    text: string;
    timeSeconds: number | null;
  }[];
}

export interface ServerSpeechDetailResponse {
  id: string;
  title: string;
  blocks: ServerSpeechBlockResponse[];
  updatedAt: string;
}

export const getSpeechServer = async (
  id: string,
): Promise<ServerSpeechDetailResponse | null> => {
  const response = await backendFetch(`/speeches/${id}`, {
    method: "GET",
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
