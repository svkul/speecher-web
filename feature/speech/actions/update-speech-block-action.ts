"use server";

import { revalidateTag } from "next/cache";

import { ApiError } from "@/shared/api";
import {
  updateSpeechBlock,
  type UpdateSpeechBlockInput,
} from "@/feature/speech/api/update-speech-block";
import type { SpeechBlockResponse } from "@/feature/speech/api/get-speech";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export type UpdateSpeechBlockActionResult =
  | { data: SpeechBlockResponse }
  | { error: string };

export async function updateSpeechBlockAction(
  speechId: string,
  blockId: string,
  input: UpdateSpeechBlockInput,
): Promise<UpdateSpeechBlockActionResult> {
  try {
    const api = await requireApiClient();
    const data = await updateSpeechBlock(api, blockId, input);

    revalidateTag(`speech-${speechId}`, "max");
    revalidateTag("speeches", "max");

    return { data };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Failed to update speech block";
    return { error: message };
  }
}
