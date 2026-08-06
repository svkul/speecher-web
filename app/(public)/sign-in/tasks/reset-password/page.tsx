"use client";

import { TaskResetPassword } from "@clerk/nextjs";

import { POST_AUTH_PATH } from "@/feature/auth/lib/create-auth-navigate";

export default function ResetPasswordTaskPage() {
  return <TaskResetPassword redirectUrlComplete={POST_AUTH_PATH} />;
}
