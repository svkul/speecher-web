import type { UseFormReturn } from "react-hook-form";

import type { OtpFormValues } from "@/feature/auth/schemas/email-auth.schema";
import { FieldError } from "@/feature/auth/ui/FieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  form: UseFormReturn<OtpFormValues>;
  onSubmit: (values: OtpFormValues) => void | Promise<void>;
  isLoading: boolean;
  title: string;
  codeLabel: string;
  verifyLabel: string;
  resendLabel: string;
  startOverLabel: string;
  clerkError?: string;
  onResend: () => void | Promise<void>;
  onStartOver: () => void;
};

export function OtpStepForm({
  form,
  onSubmit,
  isLoading,
  title,
  codeLabel,
  verifyLabel,
  resendLabel,
  startOverLabel,
  clerkError,
  onResend,
  onStartOver,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{title}</p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="code">{codeLabel}</Label>

        <Input
          id="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          aria-invalid={!!errors.code || !!clerkError}
          disabled={isLoading}
          {...register("code")}
        />

        <FieldError message={errors.code?.message ?? clerkError} />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {verifyLabel}
      </Button>

      <div className="flex flex-col gap-2 text-sm">
        <button
          type="button"
          className="text-primary underline-offset-4 hover:underline disabled:opacity-50"
          disabled={isLoading}
          onClick={() => void onResend()}
        >
          {resendLabel}
        </button>

        <button
          type="button"
          className="text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50"
          disabled={isLoading}
          onClick={onStartOver}
        >
          {startOverLabel}
        </button>
      </div>
    </form>
  );
}
