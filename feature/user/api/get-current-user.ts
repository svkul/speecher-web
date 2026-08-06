import "server-only";

import { backendFetch, getClerkSessionToken } from "@/shared/api";
import type { UserResponse } from "@/feature/user/model/types";

export type { UserResponse };
export type ServerUserResponse = UserResponse;

export const getCurrentUserServer = async (): Promise<UserResponse | null> => {
  const token = await getClerkSessionToken();

  if (!token) {
    return null;
  }

  const response = await backendFetch("/user/me", {
    method: "GET",
    token,
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as UserResponse;
};
