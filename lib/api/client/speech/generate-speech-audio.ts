export interface GenerateSpeechAudioResponse {
  successCount: number;
  failureCount: number;
}

export async function generateSpeechAudioClient(
  speechId: string,
): Promise<GenerateSpeechAudioResponse> {
  const response = await fetch(`/api/speeches/${speechId}/generate-audio`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to generate speech audio");
  }

  return (await response.json()) as GenerateSpeechAudioResponse;
}
