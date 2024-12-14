import { NextFunction, Request, Response } from "express";

import { UNAUTHORIZED } from "../constants/http";
import { verifyToken } from "../utils/jwt";
import appAssert from "../utils/app-assert";
import { AppErrorCodeEnum } from "../utils/AppError";

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCodeEnum.InvalidAccessToken
  );

  const { error, payload } = verifyToken(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCodeEnum.InvalidAccessToken
  );

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;

  next();
};

export default isAuth;
