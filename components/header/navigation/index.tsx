"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className={className}>
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