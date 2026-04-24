"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import { UserResponse } from "@/lib/auth/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


interface HeaderProps {
  user: UserResponse | null;
}

const LoginDialog = dynamic(
  () => import("@/components/LoginDialog").then((module) => module.LoginDialog),
  {
    ssr: false,
  },
);

const UserMenu = dynamic(
  () => import("@/components/UserMenu").then((module) => module.UserMenu),
  {
    ssr: false,
  },
);

export function Header({ user }: HeaderProps) {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isUserMenuEnabled, setIsUserMenuEnabled] = useState(false);

  const userInitials = (user?.firstName?.slice(0, 1).toUpperCase() || "") + (user?.lastName?.slice(0, 1).toUpperCase() || "");
  const userLabel = userInitials || user?.email || "Guest";

  const preloadUserMenu = () => {
    void import("@/components/UserMenu");
  };

  return (
    <header className="w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          <Image src="/assets/logo.svg" alt="Speecher" width={45} height={45} />
        </Link>

        <div className="flex items-center gap-3 text-sm text-zinc-700">

          {user ? (
            <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white"
                  aria-label={`User menu for ${userLabel}`}
                  type="button"
                  onMouseEnter={preloadUserMenu}
                  onFocus={preloadUserMenu}
                  onClick={() => {
                    setIsUserMenuEnabled(true);
                    setIsUserMenuOpen(true);
                  }}
                >
                  {userLabel}
                </button>
              </DropdownMenuTrigger>

              {isUserMenuEnabled ? (
                <UserMenu
                  fullName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}
                />
              ) : null}
            </DropdownMenu>
          ) : (
            <Button variant="outline" type="button" onClick={() => setIsLoginDialogOpen(true)}>Login</Button>
          )}
        </div>
      </div>

      {isLoginDialogOpen ? (
        <LoginDialog
          open={isLoginDialogOpen}
          onOpenChange={setIsLoginDialogOpen}
        />
      ) : null}
    </header>
  );
}
