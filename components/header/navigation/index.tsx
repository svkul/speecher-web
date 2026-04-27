"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { UserResponse } from "@/lib/api/client";

interface NavigationProps {
  user: UserResponse | null;
  className?: string;
}

export function Navigation({ user, className }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className={className}>
      {user && (
        <>
          <Link
            href="/dashboard"
            className={`hover:text-zinc-900 transition-colors font-bold text-lg ${pathname === "/dashboard" || pathname.startsWith('/dashboard/') ? "underline underline-offset-4 decoration-2" : ""}`}
          >
            Dashboard
          </Link>

          <Link
            href="/speeches"
            className={`hover:text-zinc-900 transition-colors font-bold text-lg ${pathname === "/speeches" || pathname.startsWith('/speeches/') ? "underline underline-offset-4 decoration-2" : ""}`}
          >
            Speeches
          </Link>
        </>
      )}

      <Link
        href="/blog"
        className={`hover:text-zinc-900 transition-colors font-bold text-lg ${pathname === "/blog" || pathname.startsWith('/blog/') ? "underline underline-offset-4 decoration-2" : ""}`}
      >
        Blog
      </Link>

      <Link
        href="/pricing"
        className={`hover:text-zinc-900 transition-colors font-bold text-lg ${pathname === "/pricing" ? "underline underline-offset-4 decoration-2" : ""}`}
      >
        Pricing
      </Link>
    </nav>
  );
}