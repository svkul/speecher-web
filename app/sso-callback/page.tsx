"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SsoCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    void (async () => {
      if (!clerk.loaded || hasRun.current) {
        return;
      }

      hasRun.current = true;

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              return;
            }

            router.replace("/dashboard");
            router.refresh();
          },
        });
        return;
      }

      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        const signInStatus = signIn.status as typeof signIn.status | "complete";
        if (signInStatus === "complete") {
          await signIn.finalize({
            navigate: async () => {
              router.replace("/dashboard");
              router.refresh();
            },
          });
        }
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: async () => {
            router.replace("/dashboard");
            router.refresh();
          },
        });
        return;
      }

      router.replace("/sign-in");
    })();
  }, [clerk, signIn, signUp, router]);

  return (
    <main className="flex min-h-[40vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">Completing sign in...</p>
      <div id="clerk-captcha" />
    </main>
  );
}
