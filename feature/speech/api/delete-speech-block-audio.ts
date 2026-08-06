import type { ApiClient } from "@/shared/api";

export function deleteSpeechBlockAudio(
  api: ApiClient,
  blockId: string,
): Promise<void> {
  return api.delete<void>(`/speeches/blocks/${blockId}/audio`);
}
