import { LoginValues } from "@/types/auth";
import API from "../config/api-client";

export const login = async (data: LoginValues) => API.post("/auth/login", data);
