import { z } from "zod";

export const emailSchema = z.string().email().min(1).max(255);

export const passwordSchema = z.string().min(6).max(255);
export const verificationCodeSchema = z.string().min(1).max(24);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});

export const forgotEmailSchema = z.object({ email: emailSchema });

export const resetPasswordNoCodeSchema = z.object({
  password: passwordSchema,
});
