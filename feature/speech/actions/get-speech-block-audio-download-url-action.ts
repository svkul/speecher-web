"use server";

import { ApiError } from "@/shared/api";
import {
  getSpeechBlockAudioDownloadUrl,
  type SpeechBlockAudioDownloadUrlResponse,
} from "@/feature/speech/api/get-speech-block-audio-download-url";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export type GetSpeechBlockAudioDownloadUrlActionResult =
  | { data: SpeechBlockAudioDownloadUrlResponse }
  | { error: string };

export async function getSpeechBlockAudioDownloadUrlAction(
  blockId: string,
): Promise<GetSpeechBlockAudioDownloadUrlActionResult> {
  try {
    const api = await requireApiClient();
    const data = await getSpeechBlockAudioDownloadUrl(api, blockId);
    return { data };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Failed to create download URL";
    return { error: message };
  }
}
