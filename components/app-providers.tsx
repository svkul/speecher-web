"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "@/lib/config";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  if (!config.googleClientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
