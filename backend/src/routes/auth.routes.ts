import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
} from "../controllers/auth.controller";

const authRoutes = Router();

// /auth

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.get("/logout", logoutController);
authRoutes.get("/refresh", refreshController);

export default authRoutes;
