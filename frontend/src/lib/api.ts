import { LoginValues, RegisterValues } from "@/types/auth";
import API from "../config/api-client";

export const login = async (data: LoginValues) => API.post("/auth/login", data);
export const register = async (data: RegisterValues) =>
  API.post("/auth/register", data);
