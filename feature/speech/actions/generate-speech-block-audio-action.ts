"use server";

import { revalidateTag } from "next/cache";

import { ApiError } from "@/shared/api";
import {
  generateSpeechBlockAudio,
  type GenerateSpeechBlockAudioResponse,
} from "@/feature/speech/api/generate-speech-block-audio";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export type GenerateSpeechBlockAudioActionResult =
  | { data: GenerateSpeechBlockAudioResponse }
  | { error: string };

export async function generateSpeechBlockAudioAction(
  speechId: string,
  blockId: string,
): Promise<GenerateSpeechBlockAudioActionResult> {
  try {
    const api = await requireApiClient();
    const data = await generateSpeechBlockAudio(api, blockId);

    if (!data.success) {
      return { error: data.error || "Failed to generate block audio" };
    }

    revalidateTag(`speech-${speechId}`, "max");
    revalidateTag("speeches", "max");

    return { data };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Failed to generate block audio";
    return { error: message };
  }
}
