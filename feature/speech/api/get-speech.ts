import type { ApiClient } from "@/shared/api";

export interface SpeechBlockResponse {
  id: string;
  order: number;
  title: string;
  text: string;
  audioUrl: string | null;
  duration: number | null;
  audioStatus?: "IDLE" | "PENDING" | "PROCESSING" | "READY" | "FAILED";
  generationError?: string | null;
  lines: {
    line: number;
    text: string;
    timeSeconds: number | null;
  }[];
}

export interface SpeechDetailResponse {
  id: string;
  title: string;
  ttsLanguage: string | null;
  ttsVoice: string | null;
  ttsModel: string | null;
  ttsStyle: string | null;
  blocks: SpeechBlockResponse[];
  updatedAt: string;
}

export function getSpeech(
  api: ApiClient,
  speechId: string,
): Promise<SpeechDetailResponse> {
  return api.get<SpeechDetailResponse>(`/speeches/${speechId}`);
}
