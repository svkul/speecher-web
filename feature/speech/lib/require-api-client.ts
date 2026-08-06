import { auth } from "@clerk/nextjs/server";

import { ApiError, createApiClient, type ApiClient } from "@/shared/api";

export async function requireApiClient(): Promise<ApiClient> {
  const { isAuthenticated, getToken } = await auth();

  if (!isAuthenticated) {
    throw new ApiError("Not authenticated", 401);
  }

  return createApiClient(getToken);
}
