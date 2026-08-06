import "server-only";

import { auth } from "@clerk/nextjs/server";

export async function getClerkSessionToken(): Promise<string | null> {
  const { getToken, isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return null;
  }

  return await getToken();
}
