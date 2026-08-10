import type { ApiClient } from "@/shared/api";
import type { SpeechBlockResponse } from "@/feature/speech/api/get-speech";

export type UpdateSpeechBlockInput = {
  title?: string;
  text?: string;
  order?: number;
};

export function updateSpeechBlock(
  api: ApiClient,
  blockId: string,
  input: UpdateSpeechBlockInput,
): Promise<SpeechBlockResponse> {
  return api.patch<SpeechBlockResponse>(`/speeches/blocks/${blockId}`, input);
}
