"use client";

import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { createAuthNavigate } from "@/feature/auth/lib/create-auth-navigate";
import {
  emailSchema,
  otpSchema,
  type EmailFormValues,
  type OtpFormValues,
} from "@/feature/auth/schemas/email-auth.schema";
import { ClerkFormErrors } from "@/feature/auth/ui/ClerkFormErrors";
import { EmailStepForm } from "@/feature/auth/ui/EmailStepForm";
import { OtpStepForm } from "@/feature/auth/ui/OtpStepForm";

export function EmailSignInFlow() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const navigate = createAuthNavigate(router);
  const isLoading = fetchStatus === "fetching";

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  const showOtp = signIn.status === "needs_first_factor";

  const onEmailSubmit = async ({ email }: EmailFormValues) => {
    const { error: createError } = await signIn.create({ identifier: email });
    if (createError) {
      return;
    }

    const { error: sendError } = await signIn.emailCode.sendCode({
      emailAddress: email,
    });
    if (sendError) {
      console.error("[sign-in] sendCode:", JSON.stringify(sendError, null, 2));
    }
  };

  const onOtpSubmit = async ({ code }: OtpFormValues) => {
    const { error } = await signIn.emailCode.verifyCode({ code });
    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate });
    }
  };

  const onResend = async () => {
    const email = emailForm.getValues("email");
    if (!email) {
      return;
    }

    await signIn.emailCode.sendCode({ emailAddress: email });
  };

  const onStartOver = () => {
    void signIn.reset();
    otpForm.reset();
    emailForm.reset();
  };

  if (showOtp) {
    return (
      <>
        <ClerkFormErrors
          fieldErrors={[errors.fields.code]}
          globalErrors={errors.global}
        />

        <OtpStepForm
          form={otpForm}
          onSubmit={onOtpSubmit}
          isLoading={isLoading}
          title="Enter the code from your email to sign in"
          codeLabel="Code"
          verifyLabel="Verify"
          resendLabel="Resend code"
          startOverLabel="Start over"
          clerkError={errors.fields.code?.message}
          onResend={onResend}
          onStartOver={onStartOver}
        />
      </>
    );
  }

  return (
    <EmailStepForm
      formErrors={
        <ClerkFormErrors
          fieldErrors={[errors.fields.identifier]}
          globalErrors={errors.global}
        />
      }
      form={emailForm}
      onSubmit={onEmailSubmit}
      isLoading={isLoading}
      emailLabel="Email"
      submitLabel="Continue"
      clerkError={errors.fields.identifier?.message}
    />
  );
}
