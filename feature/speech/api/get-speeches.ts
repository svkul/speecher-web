import type { ApiClient } from "@/shared/api";

export interface SpeechListItemResponse {
  id: string;
  title: string;
  blocks: { id: string }[];
  updatedAt: string;
}

export function getSpeeches(
  api: ApiClient,
): Promise<SpeechListItemResponse[]> {
  return api.get<SpeechListItemResponse[]>("/speeches");
}
