"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { TanstackProvider } from "@/components/TanstackProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ClerkProvider>
      <TanstackProvider>{children}</TanstackProvider>
    </ClerkProvider>
  );
}
