"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { POST_AUTH_PATH } from "@/feature/auth/lib/create-auth-navigate";

export default function SsoCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  const navigateToSignIn = () => {
    router.push("/sign-in");
  };

  const navigateHome = () => {
    router.push(POST_AUTH_PATH);
  };

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: async ({ session }) => {
        if (session?.currentTask) {
          router.push("/sign-in/tasks");
          return;
        }

        navigateHome();
      },
    });
  };

  const finalizeSignUp = async () => {
    await signUp.finalize({
      navigate: async ({ session }) => {
        if (session?.currentTask) {
          router.push("/sign-in/tasks");
          return;
        }

        navigateHome();
      },
    });
  };

  useEffect(() => {
    void (async () => {
      if (!clerk.loaded || hasRun.current) {
        return;
      }

      hasRun.current = true;

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        const signInStatus = signIn.status as typeof signIn.status | "complete";
        if (signInStatus === "complete") {
          await finalizeSignIn();
          return;
        }

        return navigateToSignIn();
      }

      if (
        signIn.status === "needs_first_factor" &&
        !signIn.supportedFirstFactors?.every(
          (factor) => factor.strategy === "enterprise_sso",
        )
      ) {
        return navigateToSignIn();
      }

      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }

        return router.push("/sign-up/complete");
      }

      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }

      if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_new_password"
      ) {
        return navigateToSignIn();
      }

      if (signIn.existingSession || signUp.existingSession) {
        const sessionId =
          signIn.existingSession?.sessionId ||
          signUp.existingSession?.sessionId;
        if (sessionId) {
          await clerk.setActive({
            session: sessionId,
            navigate: async ({ session }) => {
              if (session?.currentTask) {
                router.push("/sign-in/tasks");
                return;
              }

              navigateHome();
            },
          });
        }
      }
    })();
  }, [clerk, signIn, signUp, router]);

  return (
    <main className="mx-auto flex min-h-[40vh] w-full max-w-md items-center justify-center px-4 py-10">
      <div id="clerk-captcha" />
      <p className="text-sm text-muted-foreground">Completing sign-in…</p>
    </main>
  );
}
