"use client";

import { TaskChooseOrganization } from "@clerk/nextjs";

import { POST_AUTH_PATH } from "@/feature/auth/lib/create-auth-navigate";

export default function ChooseOrganizationTaskPage() {
  return <TaskChooseOrganization redirectUrlComplete={POST_AUTH_PATH} />;
}
