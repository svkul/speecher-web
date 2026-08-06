import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { EmailFormValues } from "@/feature/auth/schemas/email-auth.schema";
import { FieldError } from "@/feature/auth/ui/FieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  form: UseFormReturn<EmailFormValues>;
  onSubmit: (values: EmailFormValues) => void | Promise<void>;
  isLoading: boolean;
  emailLabel: string;
  submitLabel: string;
  clerkError?: string;
  captchaSlot?: ReactNode;
  formErrors?: ReactNode;
};

export function EmailStepForm({
  form,
  onSubmit,
  isLoading,
  emailLabel,
  submitLabel,
  clerkError,
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{emailLabel}</Label>

        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          aria-invalid={!!errors.email || !!clerkError}
          disabled={isLoading}
          {...register("email")}
        />

        <FieldError message={errors.email?.message ?? clerkError} />
      </div>

      {formErrors}

      {captchaSlot}

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {submitLabel}
      </Button>
    </form>
  );
}
