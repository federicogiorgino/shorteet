import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshController,
  registerController,
  verifyEmailController,
} from "../controllers/auth.controller";

const authRoutes = Router();

// /auth

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.get("/logout", logoutController);
authRoutes.get("/refresh", refreshController);
authRoutes.get("/email/verify/:code", verifyEmailController);
authRoutes.post("/password/forgot", forgotPasswordController);

export default authRoutes;
