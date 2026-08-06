import "server-only";

import { backendFetch } from "../backend-fetch";

interface ServerSpeechBlockResponse {
  id: string;
}

export interface ServerSpeechResponse {
  id: string;
  title: string;
  blocks: ServerSpeechBlockResponse[];
  updatedAt: string;
}

export const getSpeechesServer = async (): Promise<
  ServerSpeechResponse[] | null
> => {
  const response = await backendFetch("/speeches", {
    method: "GET",
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
