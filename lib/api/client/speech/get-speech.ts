export interface ClientSpeechBlockResponse {
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

export interface ClientSpeechDetailResponse {
  id: string;
  title: string;
  blocks: ClientSpeechBlockResponse[];
  updatedAt: string;
}

export async function getSpeechClient(
  speechId: string,
): Promise<ClientSpeechDetailResponse> {
  const response = await fetch(`/api/speeches/${speechId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to load speech");
  }

  return (await response.json()) as ClientSpeechDetailResponse;
}
