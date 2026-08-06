import { AuthPageShell } from "@/feature/auth/ui/AuthPageShell";
import { AuthSwitchLink } from "@/feature/auth/ui/AuthSwitchLink";
import { SignUpPageClient } from "@/feature/auth/ui/SignUpPageClient";

export default function SignUpPage() {
  return (
    <AuthPageShell
      title="Create account"
      footer={
        <AuthSwitchLink href="/sign-in" label="Already have an account? Sign in" />
      }
    >
      <SignUpPageClient />
    </AuthPageShell>
  );
}
