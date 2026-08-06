import { AuthPageShell } from "@/feature/auth/ui/AuthPageShell";
import { OAuthSignUpCompleteFlow } from "@/feature/auth/ui/OAuthSignUpCompleteFlow";

export default function SignUpCompletePage() {
  return (
    <AuthPageShell
      title="Complete sign up"
      description="Tell us your name to finish creating your account."
    >
      <OAuthSignUpCompleteFlow />
    </AuthPageShell>
  );
}
