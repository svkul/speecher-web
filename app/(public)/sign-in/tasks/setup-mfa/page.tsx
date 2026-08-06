"use client";

import { TaskSetupMFA } from "@clerk/nextjs";

import { POST_AUTH_PATH } from "@/feature/auth/lib/create-auth-navigate";

export default function SetupMfaTaskPage() {
  return <TaskSetupMFA redirectUrlComplete={POST_AUTH_PATH} />;
}
