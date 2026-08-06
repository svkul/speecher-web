"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { TanstackProvider } from "@/components/TanstackProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/sign-in"
      taskUrls={{
        "choose-organization": "/sign-in/tasks/choose-organization",
        "reset-password": "/sign-in/tasks/reset-password",
        "setup-mfa": "/sign-in/tasks/setup-mfa",
      }}
    >
      <TanstackProvider>{children}</TanstackProvider>
    </ClerkProvider>
  );
}
