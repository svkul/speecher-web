import "server-only";

import { backendFetch } from "../backend-fetch";

export interface ServerUserResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  language: string | null;
  trialUsed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getCurrentUserServer =
  async (): Promise<ServerUserResponse | null> => {
    const response = await backendFetch("/user/me", { method: "GET" });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ServerUserResponse;
  };
