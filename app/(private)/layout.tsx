import { redirect } from "next/navigation";

import { getCurrentUserServer } from "@/lib/auth/server";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect("/");
  }

  return <>{children}</>;
}
