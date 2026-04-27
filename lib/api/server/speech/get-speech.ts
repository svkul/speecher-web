import "server-only";
import { getServerRequestContext } from "../request-context";

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
  const context = await getServerRequestContext();

  if (!context) {
    return null;
  }

  const response = await fetch(
    `${context.proto}://${context.host}/api/speeches/${id}`,
    {
      method: "GET",
      headers: {
        cookie: context.cookieHeader,
        "x-language": context.language,
      },
      next: {
        tags: [`speech-${id}`],
      },
    },
  );

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ServerSpeechDetailResponse;
};
