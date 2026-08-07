import type { ApiClient } from "@/shared/api";

export type TtsLanguage = {
  code: string;
  name: string;
  availableVoices: number;
};

export type TtsLanguagesResponse = {
  languages: TtsLanguage[];
};

export function getTtsLanguages(
  api: ApiClient,
): Promise<TtsLanguagesResponse> {
  return api.get<TtsLanguagesResponse>("/speeches/tts/languages");
}
