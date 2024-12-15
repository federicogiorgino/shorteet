import {
  forgotEmailSchema,
  loginSchema,
  passwordSchema,
  registerSchema,
  resetPasswordNoCodeSchema,
  resetPasswordSchema,
} from "@/schemas/auth";
import { z } from "zod";

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotEmailValues = z.infer<typeof forgotEmailSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordNoCodeValues = z.infer<
  typeof resetPasswordNoCodeSchema
>;
