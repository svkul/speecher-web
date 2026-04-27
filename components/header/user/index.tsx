"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import type { UserResponse } from "@/lib/api/client";

import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const UserMenu = dynamic(
  () => import("@/components/header/user/UserMenu").then((module) => module.UserMenu),
  {
    ssr: false,
  },
);

const LoginDialog = dynamic(
  () => import("@/components/header/user/LoginDialog").then((module) => module.LoginDialog),
  {
    ssr: false,
  },
);

interface UserProps {
  className?: string;
  user: UserResponse | null;
}

export function User({ className, user }: UserProps) {
  const userInitials = (user?.firstName?.slice(0, 1).toUpperCase() || "") + (user?.lastName?.slice(0, 1).toUpperCase() || "");
  const userLabel = userInitials || user?.email || "Guest";

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isUserMenuEnabled, setIsUserMenuEnabled] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const preloadUserMenu = () => {
    void import("@/components/header/user/UserMenu");
  };

  if (user) {
    return (
      <div className={className}>
        <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-basic font-bold text-white"
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
      </div>
    );
  }

  return (
    <div className={className}>
      <Button variant="outline" type="button" onClick={() => setIsLoginDialogOpen(true)}>Login</Button>

      {isLoginDialogOpen ? (
        <LoginDialog
          open={isLoginDialogOpen}
          onOpenChange={setIsLoginDialogOpen}
        />
      ) : null}
    </div>
  );
}