"use server";

import { revalidateTag } from "next/cache";

import { ApiError } from "@/shared/api";
import {
  generateSpeechAudio,
  type GenerateSpeechAudioResponse,
} from "@/feature/speech/api/generate-speech-audio";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export type GenerateSpeechAudioActionResult =
  | { data: GenerateSpeechAudioResponse }
  | { error: string };

export async function generateSpeechAudioAction(
  speechId: string,
): Promise<GenerateSpeechAudioActionResult> {
  try {
    const api = await requireApiClient();
    const data = await generateSpeechAudio(api, speechId);

    revalidateTag(`speech-${speechId}`, "max");
    revalidateTag("speeches", "max");

    return { data };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Failed to generate speech audio";
    return { error: message };
  }
}
