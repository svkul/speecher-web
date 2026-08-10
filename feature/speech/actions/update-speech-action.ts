"use server";

import { revalidateTag } from "next/cache";

import { ApiError } from "@/shared/api";
import {
  updateSpeech,
  type UpdateSpeechInput,
} from "@/feature/speech/api/update-speech";
import type { SpeechDetailResponse } from "@/feature/speech/api/get-speech";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export type UpdateSpeechActionResult =
  | { data: SpeechDetailResponse }
  | { error: string };

export async function updateSpeechAction(
  speechId: string,
  input: UpdateSpeechInput,
): Promise<UpdateSpeechActionResult> {
  try {
    const api = await requireApiClient();
    const data = await updateSpeech(api, speechId, input);

    revalidateTag(`speech-${speechId}`, "max");
    revalidateTag("speeches", "max");

    return { data };
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to update speech";
    return { error: message };
  }
}
