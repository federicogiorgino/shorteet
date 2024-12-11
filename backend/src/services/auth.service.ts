import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verification-code.model";
import VerificationCodeType from "../types/verification-code.type";
import appAssert from "../utils/app-assert";
import { oneYearFromNow } from "../utils/dates";
import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";
import { refreshTokenSignOptions, signToken } from "../utils/jwt";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export type LoginParams = {
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
  const refreshToken = signToken(
    {
      sessionId: session._id,
    },
    refreshTokenSignOptions
  );

  //cretes an access token that is gonna be used on every user request
  const accessToken = signToken({
    userId: user._id,
    sessionId: session._id,
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  const user = await UserModel.findOne({ email });

  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  const isValid = await user.comparePassword(password);

  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  const userId = user._id;

  // creates a session
  const session = await SessionModel.create({
    userId,
    userAgent,
  });

  const sessionInfo = {
    sessionId: session._id,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  //cretes an access token that is gonna be used on every user request
  const accessToken = signToken({
    ...sessionInfo,
    userId: user._id,
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};
