"use client";

import { AuthDivider } from "@/feature/auth/ui/AuthDivider";
import { EmailSignInFlow } from "@/feature/auth/ui/EmailSignInFlow";
import { SignInWithGoogle } from "@/feature/auth/ui/SignInWithGoogle";

type Props = {
  orLabel?: string;
};

export function SignInPageClient({ orLabel = "or" }: Props) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <SignInWithGoogle />
      </div>

      <AuthDivider label={orLabel} />

      <EmailSignInFlow />
    </>
  );
}
