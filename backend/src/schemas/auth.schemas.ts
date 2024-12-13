import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(1).max(255),
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(1).max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export const verificationCodeSchema = z.string().min(1).max(24);
