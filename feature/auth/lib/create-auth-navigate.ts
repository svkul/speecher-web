type AppRouter = {
  push: (href: string) => void;
};

type NavigateArgs = {
  session?: { currentTask?: unknown } | null;
};

export const POST_AUTH_PATH = "/dashboard";

export function createAuthNavigate(router: AppRouter) {
  return async ({ session }: NavigateArgs) => {
    if (session?.currentTask) {
      router.push("/sign-in/tasks");
      return;
    }

    router.push(POST_AUTH_PATH);
  };
}
