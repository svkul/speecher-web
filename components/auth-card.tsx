"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import { signInWithGoogle } from "@/lib/auth/sign-in";
import { signOut } from "@/lib/auth/sign-out";
import { UserResponse } from "@/lib/auth/types";
import { config } from "@/lib/config";

interface AuthCardProps {
  user: UserResponse | null;
}

export function AuthCard({ user }: AuthCardProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      setError("Google did not return idToken");
      return;
    }

    setError(null);

    try {
      await signInWithGoogle(idToken);
      router.refresh();
    } catch {
      setError("Sign in failed");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setError(null);
      router.refresh();
    } catch {
      setError("Sign out failed");
    }
  };

  if (!config.googleClientId) {
    return (
      <p className="text-sm text-red-600">
        Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID. Google auth is disabled.
      </p>
    );
  }

  return (
    <section className="w-full max-w-md rounded-2xl border border-zinc-200 p-6">
      <h2 className="mb-3 text-xl font-semibold text-zinc-900">Authentication</h2>

      {user ? (
        <div className="space-y-3">
          <p className="text-sm text-zinc-700">
            Signed in as <span className="font-medium">{user.email}</span>
          </p>

          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Sign out
          </button>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={(response) => {
            void handleGoogleSuccess(response);
          }}
          onError={() => {
            setError("Google sign in was cancelled or failed");
          }}
        />
      )}

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </section>
  );
}
