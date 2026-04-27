export async function signOut(): Promise<void> {
  const response = await fetch("/api/auth/signout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-language": "uk",
    },
    credentials: "include",
  });

  if (!response.ok && response.status !== 401) {
    throw new Error("Failed to sign out");
  }
}
