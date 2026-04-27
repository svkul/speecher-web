"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "@/lib/config";
import { TanstackProvider } from "@/components/TanstackProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  if (!config.googleClientId) {
    return <TanstackProvider>{children}</TanstackProvider>;
  }

  return (
    <TanstackProvider>
      <GoogleOAuthProvider clientId={config.googleClientId} locale="en">
        {children}
      </GoogleOAuthProvider>
    </TanstackProvider>
  );
}
