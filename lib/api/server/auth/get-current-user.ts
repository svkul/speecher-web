import "server-only";
import { getServerRequestContext } from "../request-context";

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

// export const getCurrentUserServer = cache(
export const getCurrentUserServer =
  async (): Promise<ServerUserResponse | null> => {
    const context = await getServerRequestContext();

    if (!context) {
      return null;
    }

    const response = await fetch(
      `${context.proto}://${context.host}/api/user/me`,
      {
        method: "GET",
        headers: {
          cookie: context.cookieHeader,
          "x-language": context.language,
        },
        cache: "no-store",
      },
    );

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ServerUserResponse;
  };
