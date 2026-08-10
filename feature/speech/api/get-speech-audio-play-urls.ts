import type { ApiClient } from "@/shared/api";

export interface SpeechAudioPlayUrlsResponse {
  speechId: string;
  expiresInSeconds: number;
  items: Array<{
    blockId: string;
    url: string;
  }>;
}

export function getSpeechAudioPlayUrls(
  api: ApiClient,
  speechId: string,
): Promise<SpeechAudioPlayUrlsResponse> {
  return api.get<SpeechAudioPlayUrlsResponse>(
    `/speeches/${speechId}/audio/play-urls`,
  );
}
