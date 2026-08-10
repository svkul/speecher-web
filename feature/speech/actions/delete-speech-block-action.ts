"use server";

import { revalidateTag } from "next/cache";

import { ApiError } from "@/shared/api";
import { deleteSpeechBlock } from "@/feature/speech/api/delete-speech-block";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export type DeleteSpeechBlockActionResult = { error?: string };

export async function deleteSpeechBlockAction(
  speechId: string,
  blockId: string,
): Promise<DeleteSpeechBlockActionResult> {
  try {
    const api = await requireApiClient();
    await deleteSpeechBlock(api, blockId);

    revalidateTag(`speech-${speechId}`, "max");
    revalidateTag("speeches", "max");

    return {};
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Failed to delete speech block";
    return { error: message };
  }
}
