import type { ApiClient } from "@/shared/api";

export function deleteSpeechBlock(
  api: ApiClient,
  blockId: string,
): Promise<void> {
  return api.delete<void>(`/speeches/blocks/${blockId}`);
}
