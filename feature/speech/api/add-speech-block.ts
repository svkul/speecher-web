import type { ApiClient } from "@/shared/api";
import type { SpeechBlockResponse } from "@/feature/speech/api/get-speech";

export type AddSpeechBlockInput = {
  title: string;
  text: string;
  order?: number;
};

export function addSpeechBlock(
  api: ApiClient,
  speechId: string,
  input: AddSpeechBlockInput,
): Promise<SpeechBlockResponse> {
  return api.post<SpeechBlockResponse>(`/speeches/${speechId}/blocks`, input);
}
