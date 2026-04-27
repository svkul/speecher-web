export async function deleteSpeechBlockAudioClient(
  blockId: string,
): Promise<void> {
  const response = await fetch(`/api/speeches/blocks/${blockId}/audio`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete audio");
  }
}
