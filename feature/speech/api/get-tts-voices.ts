import type { ApiClient } from "@/shared/api";

export type TtsVoice = {
  languageCodes: string[];
  name: string;
  ssmlGender: "MALE" | "FEMALE" | "NEUTRAL";
  naturalSampleRateHertz: number;
};

export type TtsVoicesResponse = {
  voices: TtsVoice[];
};

export function getTtsVoices(
  api: ApiClient,
  language?: string,
): Promise<TtsVoicesResponse> {
  const query = language
    ? `?language=${encodeURIComponent(language)}`
    : "";
  return api.get<TtsVoicesResponse>(`/speeches/tts/voices${query}`);
}
