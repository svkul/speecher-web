"use client";

import type { OAuthStrategy } from "@clerk/types";
import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export function SignInWithGoogle() {
  const { signIn } = useSignIn();

  const signInWith = async (strategy: OAuthStrategy) => {
    const { error } = await signIn.sso({
      strategy,
      redirectCallbackUrl: "/sso-callback",
      redirectUrl: "/sign-in/tasks",
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      onClick={() => signInWith("oauth_google")}
    >
      <Image src="/google.png" alt="" width={20} height={20} />
      Continue with Google
    </Button>
  );
}
