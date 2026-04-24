"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { signOut } from "@/lib/auth/sign-out";

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
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Sign out failed");
    }
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
