"use client";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { createAuthNavigate } from "@/feature/auth/lib/create-auth-navigate";
import {
  otpSchema,
  signUpDetailsSchema,
  type OtpFormValues,
  type SignUpDetailsFormValues,
} from "@/feature/auth/schemas/email-auth.schema";
import { ClerkCaptcha } from "@/feature/auth/ui/ClerkCaptcha";
import { ClerkFormErrors } from "@/feature/auth/ui/ClerkFormErrors";
import { OtpStepForm } from "@/feature/auth/ui/OtpStepForm";
import { SignUpDetailsForm } from "@/feature/auth/ui/SignUpDetailsForm";

export function EmailSignUpFlow() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const navigate = createAuthNavigate(router);
  const isLoading = fetchStatus === "fetching";

  const detailsForm = useForm<SignUpDetailsFormValues>({
    resolver: zodResolver(signUpDetailsSchema),
    defaultValues: { email: "", firstName: "", lastName: "" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  const emailNeedsVerification =
    signUp.unverifiedFields.includes("email_address");

  const showOtp =
    signUp.status === "missing_requirements" && emailNeedsVerification;

  const onDetailsSubmit = async ({
    email,
    firstName,
    lastName,
  }: SignUpDetailsFormValues) => {
    const { error: createError } = await signUp.create({
      emailAddress: email,
      firstName,
      lastName,
    });
    if (createError) {
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      console.error(
        "[sign-up] sendEmailCode:",
        JSON.stringify(sendError, null, 2),
      );
    }
  };

  const onOtpSubmit = async ({ code }: OtpFormValues) => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      return;
    }

    if (signUp.missingFields.length > 0) {
      const { firstName, lastName } = detailsForm.getValues();
      const { error: updateError } = await signUp.update({
        firstName,
        lastName,
      });
      if (updateError) {
        return;
      }
    }

    if (signUp.status === "complete") {
      await signUp.finalize({ navigate });
    }
  };

  const onResend = async () => {
    await signUp.verifications.sendEmailCode();
  };

  const onStartOver = () => {
    void signUp.reset();
    otpForm.reset();
    detailsForm.reset();
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
          title="Enter the code from your email to finish sign up"
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
    <SignUpDetailsForm
      form={detailsForm}
      onSubmit={onDetailsSubmit}
      isLoading={isLoading}
      emailLabel="Email"
      firstNameLabel="First name"
      lastNameLabel="Last name"
      submitLabel="Continue"
      clerkErrors={{
        email: errors.fields.emailAddress?.message,
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
