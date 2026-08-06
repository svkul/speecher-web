"use client";

import { RedirectToTasks, useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { POST_AUTH_PATH } from "@/feature/auth/lib/create-auth-navigate";

export default function SignInTasksPage() {
  const { session, isLoaded } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    if (session.status === "active" && !session.currentTask) {
      router.replace(POST_AUTH_PATH);
    }
  }, [isLoaded, session, router]);

  if (!isLoaded) {
    return (
      <main className="mx-auto flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  if (session.currentTask) {
    return <RedirectToTasks redirectUrl={POST_AUTH_PATH} />;
  }

  if (session.status === "active") {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-[40vh] items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">Completing sign-in…</p>
    </main>
  );
}
