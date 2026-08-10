import type { ApiClient } from "@/shared/api";

export interface GenerateSpeechAudioResponse {
  successCount: number;
  failureCount: number;
  status?: "processing" | "completed";
}

export function generateSpeechAudio(
  api: ApiClient,
  speechId: string,
): Promise<GenerateSpeechAudioResponse> {
  return api.post<GenerateSpeechAudioResponse>(
    `/speeches/${speechId}/generate-audio`,
  );
}
