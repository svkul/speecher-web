import type { ApiClient } from "@/shared/api";
import type { SpeechDetailResponse } from "@/feature/speech/api/get-speech";

export type UpdateSpeechInput = {
  title?: string;
  ttsLanguage?: string;
  ttsVoice?: string;
  ttsModel?: string;
  ttsStyle?: string;
};

export function updateSpeech(
  api: ApiClient,
  speechId: string,
  input: UpdateSpeechInput,
): Promise<SpeechDetailResponse> {
  return api.patch<SpeechDetailResponse>(`/speeches/${speechId}`, input);
}
