import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT } from "../constants/http";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verification-code.model";
import VerificationCodeType from "../types/verification-code.type";
import appAssert from "../utils/app-assert";
import { oneYearFromNow } from "../utils/dates";
import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export const createAccount = async (data: CreateAccountParams) => {
  const existingUser = await UserModel.findOne({ email: data.email });

  appAssert(!existingUser, CONFLICT, "Email already in use");

  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  const userId = user._id;

  //creates a verification code
  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  // future email verification

  // creates a session
  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent,
  });

  // creates a jwt that expires in 30d
  const refreshToken = jwt.sign(
    {
      sessionId: session._id,
    },
    JWT_REFRESH_SECRET,
    { audience: ["user"], expiresIn: "30d" }
  );

  //cretes an access token that is gonna be used on every user request
  const accessToken = jwt.sign(
    {
      userId: user._id,
      sessionId: session._id,
    },
    JWT_SECRET,
    { audience: ["user"], expiresIn: "15m" }
  );

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};
