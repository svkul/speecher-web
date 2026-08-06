"use client";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  createAuthNavigate,
  POST_AUTH_PATH,
} from "@/feature/auth/lib/create-auth-navigate";
import {
  nameSchema,
  type NameFormValues,
} from "@/feature/auth/schemas/email-auth.schema";
import { ClerkCaptcha } from "@/feature/auth/ui/ClerkCaptcha";
import { ClerkFormErrors } from "@/feature/auth/ui/ClerkFormErrors";
import { CompleteSignUpNameForm } from "@/feature/auth/ui/CompleteSignUpNameForm";

export function OAuthSignUpCompleteFlow() {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const navigate = createAuthNavigate(router);
  const isLoading = fetchStatus === "fetching";

  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { firstName: "", lastName: "" },
  });

  useEffect(() => {
    if (signUp.status === "complete") {
      router.replace(POST_AUTH_PATH);
    }
  }, [signUp.status, router]);

  const onSubmit = async ({ firstName, lastName }: NameFormValues) => {
    const { error } = await signUp.update({ firstName, lastName });
    if (error) {
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({ navigate });
    } else if (signUp.status !== "missing_requirements") {
      console.error("Sign-up attempt not complete:", signUp.status);
    }
  };

  if (signUp.status === "complete") {
    return null;
  }

  return (
    <CompleteSignUpNameForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      firstNameLabel="First name"
      lastNameLabel="Last name"
      submitLabel="Continue"
      clerkErrors={{
        firstName: errors.fields.firstName?.message,
        lastName: errors.fields.lastName?.message,
      }}
      formErrors={
        <ClerkFormErrors
          fieldErrors={[errors.fields.captcha]}
          globalErrors={errors.global}
        />
      }
      captchaSlot={<ClerkCaptcha />}
    />
  );
}
