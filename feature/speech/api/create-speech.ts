import type { ApiClient } from "@/shared/api";
import type { SpeechDetailResponse } from "@/feature/speech/api/get-speech";

export type CreateSpeechBlockInput = {
  title: string;
  text: string;
  order: number;
};

export type CreateSpeechInput = {
  title: string;
  blocks: CreateSpeechBlockInput[];
  ttsLanguage?: string;
  ttsVoice?: string;
  ttsModel?: string;
  ttsStyle?: string;
};

export function createSpeech(
  api: ApiClient,
  input: CreateSpeechInput,
): Promise<SpeechDetailResponse> {
  return api.post<SpeechDetailResponse>("/speeches", input);
}
