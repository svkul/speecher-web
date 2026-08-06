import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { SignUpDetailsFormValues } from "@/feature/auth/schemas/email-auth.schema";
import { FieldError } from "@/feature/auth/ui/FieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  form: UseFormReturn<SignUpDetailsFormValues>;
  onSubmit: (values: SignUpDetailsFormValues) => void | Promise<void>;
  isLoading: boolean;
  emailLabel: string;
  firstNameLabel: string;
  lastNameLabel: string;
  submitLabel: string;
  clerkErrors?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  captchaSlot?: ReactNode;
  formErrors?: ReactNode;
};

export function SignUpDetailsForm({
  form,
  onSubmit,
  isLoading,
  emailLabel,
  firstNameLabel,
  lastNameLabel,
  submitLabel,
  clerkErrors,
  captchaSlot,
  formErrors,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">{firstNameLabel}</Label>

          <Input
            id="firstName"
            type="text"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName || !!clerkErrors?.firstName}
            disabled={isLoading}
            {...register("firstName")}
          />

          <FieldError
            message={errors.firstName?.message ?? clerkErrors?.firstName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">{lastNameLabel}</Label>

          <Input
            id="lastName"
            type="text"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName || !!clerkErrors?.lastName}
            disabled={isLoading}
            {...register("lastName")}
          />

          <FieldError
            message={errors.lastName?.message ?? clerkErrors?.lastName}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{emailLabel}</Label>

        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          aria-invalid={!!errors.email || !!clerkErrors?.email}
          disabled={isLoading}
          {...register("email")}
        />

        <FieldError message={errors.email?.message ?? clerkErrors?.email} />
      </div>

      {formErrors}

      {captchaSlot}

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {submitLabel}
      </Button>
    </form>
  );
}
