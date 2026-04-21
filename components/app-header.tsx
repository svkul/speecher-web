"use client";

import Link from "next/link";
import { UserResponse } from "@/lib/auth/types";

interface AppHeaderProps {
  user: UserResponse | null;
}

export function AppHeader({ user }: AppHeaderProps) {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const userLabel = fullName || user?.email || "Guest";

  return (
    <header className="w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          Speecher
        </Link>

        <div className="flex items-center gap-3 text-sm text-zinc-700">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white"
            aria-hidden
          >
            {userLabel.slice(0, 1).toUpperCase()}
          </span>
          <span>{userLabel}</span>
        </div>
      </div>
    </header>
  );
}
