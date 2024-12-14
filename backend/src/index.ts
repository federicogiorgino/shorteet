import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from "./middleware/error-handler";
import authRoutes from "./routes/auth.routes";
import isAuth from "./middleware/is-auth";
import userRoutes from "./routes/user.routes";
import sessionRoutes from "./routes/session.routes";

const app = express();

// add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// health check
app.get("/", async (_, res) => {
  return res.status(200).json({
    status: "healthy",
  });
});

app.use("/auth", authRoutes);
app.use("/user", isAuth, userRoutes);
app.use("/sessions", isAuth, sessionRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});
