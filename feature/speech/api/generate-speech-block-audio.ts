import type { ApiClient } from "@/shared/api";

export interface GenerateSpeechBlockAudioResponse {
  blockId: string;
  audioUrl: string;
  duration: number;
  charactersUsed: number;
  success: boolean;
  error?: string;
}

export function generateSpeechBlockAudio(
  api: ApiClient,
  blockId: string,
): Promise<GenerateSpeechBlockAudioResponse> {
  return api.post<GenerateSpeechBlockAudioResponse>(
    `/speeches/blocks/${blockId}/generate-audio`,
  );
}
