"use server";

import { revalidateTag } from "next/cache";

import { ApiError } from "@/shared/api";
import { deleteSpeech } from "@/feature/speech/api/delete-speech";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export type DeleteSpeechActionResult = { error?: string };

export async function deleteSpeechAction(
  speechId: string,
): Promise<DeleteSpeechActionResult> {
  try {
    const api = await requireApiClient();
    await deleteSpeech(api, speechId);

    revalidateTag(`speech-${speechId}`, "max");
    revalidateTag("speeches", "max");

    return {};
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to delete speech";
    return { error: message };
  }
}
