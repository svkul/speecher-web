import "server-only";
import { cache } from "react";
import { getServerRequestContext } from "./request-context";

interface ServerSpeechBlockResponse {
  id: string;
}

export interface ServerSpeechResponse {
  id: string;
  title: string;
  blocks: ServerSpeechBlockResponse[];
  updatedAt: string;
}

export const getSpeechesServer = cache(
  async (): Promise<ServerSpeechResponse[] | null> => {
    const context = await getServerRequestContext();

    if (!context) {
      return null;
    }

    const response = await fetch(
      `${context.proto}://${context.host}/api/speeches`,
      {
        method: "GET",
        headers: {
          cookie: context.cookieHeader,
          "x-language": context.language,
        },
        cache: "no-store",
      },
    );

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ServerSpeechResponse[];
  },
);
