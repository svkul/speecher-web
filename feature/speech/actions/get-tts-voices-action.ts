"use server";

import { ApiError } from "@/shared/api";
import {
  getTtsVoices,
  type TtsVoicesResponse,
} from "@/feature/speech/api/get-tts-voices";
import { requireApiClient } from "@/feature/speech/lib/require-api-client";

export type GetTtsVoicesActionResult =
  | { data: TtsVoicesResponse }
  | { error: string };

export async function getTtsVoicesAction(
  language: string,
): Promise<GetTtsVoicesActionResult> {
  try {
    const api = await requireApiClient();
    const data = await getTtsVoices(api, language);
    return { data };
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Failed to load voices";
    return { error: message };
  }
}
