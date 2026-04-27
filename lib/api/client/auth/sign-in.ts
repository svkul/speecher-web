import { UserResponse, OAuthSignInResponse } from "./types";

export async function signInWithGoogle(idToken: string): Promise<UserResponse> {
  const response = await fetch("/api/auth/oauth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-language": "uk",
    },
    credentials: "include",
    body: JSON.stringify({
      provider: "GOOGLE",
      idToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Google sign in failed");
  }

  const data = (await response.json()) as OAuthSignInResponse;
  return data.user;
}
