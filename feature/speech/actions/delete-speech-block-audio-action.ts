"use server";

import { revalidateTag } from "next/cache";

import { ApiError } from "@/shared/api";
import { deleteSpeechBlockAudio } from "@/feature/speech/api/delete-speech-block-audio";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export type DeleteSpeechBlockAudioActionResult = { error?: string };

export async function deleteSpeechBlockAudioAction(
  speechId: string,
  blockId: string,
): Promise<DeleteSpeechBlockAudioActionResult> {
  try {
    const api = await requireApiClient();
    await deleteSpeechBlockAudio(api, blockId);

    revalidateTag(`speech-${speechId}`, "max");
    revalidateTag("speeches", "max");

    return {};
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to delete audio";
    return { error: message };
  }
}
