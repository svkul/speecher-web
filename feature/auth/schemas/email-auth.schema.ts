import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email(),
});

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, { message: "Code must be 6 digits" })
    .regex(/^\d+$/, { message: "Code must contain only digits" }),
});

export const nameSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

export const signUpDetailsSchema = emailSchema.extend({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type NameFormValues = z.infer<typeof nameSchema>;
export type SignUpDetailsFormValues = z.infer<typeof signUpDetailsSchema>;
