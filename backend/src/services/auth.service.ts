import { APP_ORIGIN, JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../constants/http";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verification-code.model";
import VerificationCodeType from "../types/verification-code.type";
import appAssert from "../utils/app-assert";
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/dates";
import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";
import { refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";
import { getVerifyEmailTemplate, sendMail } from "../utils/email";

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

  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;

  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });

  appAssert(error, INTERNAL_SERVER_ERROR, "Failed to send verification email");

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

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload, error } = verifyToken(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await SessionModel.findById(payload.sessionId);

  appAssert(
    session && session.expiresAt.getTime() > Date.now(),
    UNAUTHORIZED,
    "Session expired"
  );

  // session refresh of expires in the future 24 hrs
  const needsRefresh = session.expiresAt.getTime() < Date.now() + ONE_DAY_MS;

  if (needsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = needsRefresh
    ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return { accessToken, newRefreshToken };
};

export const verifyEmail = async (verificationCode: string) => {
  const isValid = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: Date.now() },
  });

  appAssert(isValid, NOT_FOUND, "Invalid/expired verification code");

  const user = await UserModel.findByIdAndUpdate(
    isValid.userId,
    { verified: true },
    { new: true }
  );

  appAssert(user, INTERNAL_SERVER_ERROR, "Failed to verify email");

  await isValid.deleteOne();

  return {
    user: user.omitPassword(),
  };
};
