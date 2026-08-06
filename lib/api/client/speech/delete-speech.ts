export async function deleteSpeechClient(id: string): Promise<void> {
  const response = await fetch(`/api/speeches/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete speech");
  }
}
