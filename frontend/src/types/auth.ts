import { loginSchema, registerSchema } from "@/schemas/auth";
import { z } from "zod";

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
