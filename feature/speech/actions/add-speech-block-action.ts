"use server";

import { revalidateTag } from "next/cache";

import { ApiError } from "@/shared/api";
import {
  addSpeechBlock,
  type AddSpeechBlockInput,
} from "@/feature/speech/api/add-speech-block";
import type { SpeechBlockResponse } from "@/feature/speech/api/get-speech";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export type AddSpeechBlockActionResult =
  | { data: SpeechBlockResponse }
  | { error: string };

export async function addSpeechBlockAction(
  speechId: string,
  input: AddSpeechBlockInput,
): Promise<AddSpeechBlockActionResult> {
  try {
    const api = await requireApiClient();
    const data = await addSpeechBlock(api, speechId, input);

    revalidateTag(`speech-${speechId}`, "max");
    revalidateTag("speeches", "max");

    return { data };
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to add speech block";
    return { error: message };
  }
}
