"use client";

import Link from "next/link";
import Image from "next/image";

import { UserResponse } from "@/lib/auth/types";
import { User } from "@/components/header/user";
import { Navigation } from "@/components/header/navigation";

interface HeaderProps {
  user: UserResponse | null;
}


export function Header({ user }: HeaderProps) {
  return (
    <header className="w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          <Image src="/assets/logo.svg" alt="Speecher" width={45} height={45} />
        </Link>

        <Navigation className="flex items-center gap-4 text-base text-zinc-700 ml-3 mr-3" user={user} />

        <User className="ml-auto flex items-center text-zinc-700" user={user} />
      </div>
    </header>
  );
}