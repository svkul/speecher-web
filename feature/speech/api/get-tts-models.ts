import type { ApiClient } from "@/shared/api";

export type TtsModelInfo = {
  name: string;
  price: number;
  freeLimit: number;
  description: string;
};

export type TtsModelsResponse = {
  models: TtsModelInfo[];
  recommendedModel: string;
};

export function getTtsModels(api: ApiClient): Promise<TtsModelsResponse> {
  return api.get<TtsModelsResponse>("/speeches/tts/models");
}
