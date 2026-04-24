"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { signInWithGoogle } from "@/lib/auth/sign-in";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({
  open,
  onOpenChange,
}: LoginDialogProps) {
  const router = useRouter();

  const handleGoogleSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      const idToken = credentialResponse.credential;

      if (!idToken) {
        toast.error("Google did not return idToken");
        return;
      }

      try {
        await signInWithGoogle(idToken);
        router.refresh();
        onOpenChange(false);
        toast.success("Sign in successful");
      } catch {
        toast.error("Sign in failed");
      }
    },
    [onOpenChange, router],
  );

  const handleGoogleError = useCallback(() => {
    toast.error("Google sign in was cancelled or failed");
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>

          <DialogDescription>
            Login to your account to continue.
          </DialogDescription>
        </DialogHeader>

        {open ? (
          <GoogleLogin
            onSuccess={(response) => {
              void handleGoogleSuccess(response);
            }}
            onError={handleGoogleError}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
