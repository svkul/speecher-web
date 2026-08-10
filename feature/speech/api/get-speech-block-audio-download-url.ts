import type { ApiClient } from "@/shared/api";

export interface SpeechBlockAudioDownloadUrlResponse {
  url: string;
  fileName: string;
  expiresInSeconds: number;
}

export function getSpeechBlockAudioDownloadUrl(
  api: ApiClient,
  blockId: string,
): Promise<SpeechBlockAudioDownloadUrlResponse> {
  return api.get<SpeechBlockAudioDownloadUrlResponse>(
    `/speeches/blocks/${blockId}/audio/download-url`,
  );
}
