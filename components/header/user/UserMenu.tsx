"use client";

import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  fullName: string;
}

export function UserMenu({ fullName }: UserMenuProps) {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    void signOut({ redirectUrl: "/sign-in" }).catch(() => {
      toast.error("Sign out failed");
    });
  };

  return (
    <DropdownMenuContent className="w-40" align="end">
      <DropdownMenuGroup>
        <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
