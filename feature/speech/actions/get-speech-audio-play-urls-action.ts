"use server";

import { ApiError } from "@/shared/api";
import {
  getSpeechAudioPlayUrls,
  type SpeechAudioPlayUrlsResponse,
} from "@/feature/speech/api/get-speech-audio-play-urls";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export type GetSpeechAudioPlayUrlsActionResult =
  | { data: SpeechAudioPlayUrlsResponse }
  | { error: string };

export async function getSpeechAudioPlayUrlsAction(
  speechId: string,
): Promise<GetSpeechAudioPlayUrlsActionResult> {
  try {
    const api = await requireApiClient();
    const data = await getSpeechAudioPlayUrls(api, speechId);
    return { data };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Failed to create play URLs";
    return { error: message };
  }
}
