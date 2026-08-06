"use client";

import { useSignIn } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function SignInWithGoogle() {
  const { signIn } = useSignIn();

  const signInWithGoogle = async () => {
    if (!signIn) {
      return;
    }

    const { error } = await signIn.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: "/sso-callback",
      redirectUrl: "/sign-in",
    });

    if (error) {
      console.error("Google sign in failed:", error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => void signInWithGoogle()}
      disabled={!signIn}
    >
      Sign in with Google
    </Button>
  );
}
