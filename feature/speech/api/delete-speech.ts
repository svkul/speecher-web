import type { ApiClient } from "@/shared/api";

export function deleteSpeech(api: ApiClient, speechId: string): Promise<void> {
  return api.delete<void>(`/speeches/${speechId}`);
}
