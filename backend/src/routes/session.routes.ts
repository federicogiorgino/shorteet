import { Router } from "express";
import { getSessionController } from "../controllers/session.controller";
const sessionRoutes = Router();

// prefix: /sessions
sessionRoutes.get("/", getSessionController);

export default sessionRoutes;
