import { loginSchema } from "@/schemas/auth";
import { z } from "zod";

export type LoginValues = z.infer<typeof loginSchema>;
