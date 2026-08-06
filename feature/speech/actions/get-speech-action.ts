"use server";

import { ApiError } from "@/shared/api";
import {
  getSpeech,
  type SpeechDetailResponse,
} from "@/feature/speech/api/get-speech";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export async function getSpeechAction(
  speechId: string,
): Promise<SpeechDetailResponse> {
  try {
    const api = await requireApiClient();
    return await getSpeech(api, speechId);
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to load speech";
    throw new Error(message);
  }
}
