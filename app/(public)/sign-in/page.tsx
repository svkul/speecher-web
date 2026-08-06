import { AuthPageShell } from "@/feature/auth/ui/AuthPageShell";
import { AuthSwitchLink } from "@/feature/auth/ui/AuthSwitchLink";
import { SignInPageClient } from "@/feature/auth/ui/SignInPageClient";

export default function SignInPage() {
  return (
    <AuthPageShell
      title="Sign in"
      footer={
        <AuthSwitchLink href="/sign-up" label="Don't have an account? Sign up" />
      }
    >
      <SignInPageClient />
    </AuthPageShell>
  );
}
