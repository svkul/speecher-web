"use server";

import { revalidateTag } from "next/cache";

import { ApiError } from "@/shared/api";
import {
  createSpeech,
  type CreateSpeechInput,
} from "@/feature/speech/api/create-speech";
import type { SpeechDetailResponse } from "@/feature/speech/api/get-speech";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export type CreateSpeechActionResult =
  | { data: SpeechDetailResponse }
  | { error: string };

export async function createSpeechAction(
  input: CreateSpeechInput,
): Promise<CreateSpeechActionResult> {
  try {
    const api = await requireApiClient();
    const data = await createSpeech(api, input);

    revalidateTag("speeches", "max");
    revalidateTag(`speech-${data.id}`, "max");

    return { data };
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to create speech";
    return { error: message };
  }
}
