import { CREATED, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http";
import SessionModel from "../models/session.model";
import VerificationCodeModel from "../models/verification-code.model";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from "../schemas/auth.schemas";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendResetPasswordEmail,
  verifyEmail,
} from "../services/auth.service";
import appAssert from "../utils/app-assert";
import catchErrors from "../utils/catch-errors";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { verifyToken } from "../utils/jwt";

export const registerController = catchErrors(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { user, accessToken, refreshToken } = await createAccount(request);

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});

export const loginController = catchErrors(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { accessToken, refreshToken } = await loginUser(request);

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json({ message: "Login successful" });
});

export const logoutController = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || "");

  if (payload) {
    // remove session from db
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  // clear cookies
  return clearAuthCookies(res)
    .status(OK)
    .json({ message: "Logout successful" });
});

export const refreshController = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "Invalid refresh token");

  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({ message: "Access token refreshed" });
});

export const verifyEmailController = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  await verifyEmail(verificationCode);

  return res.status(OK).json({ message: "Email verified" });
});

export const forgotPasswordController = catchErrors(async (req, res) => {
  const email = emailSchema.parse(req.body.email);

  const foundEmail = await VerificationCodeModel.findOne({ email }).select(
    "email"
  );
  appAssert(foundEmail, NOT_FOUND, "Email not found");

  await sendResetPasswordEmail(email);

  return res.status(OK).json({ message: "Password reset email sent" });
});

export const resetPasswordController = catchErrors(async (req, res) => {
  const request = resetPasswordSchema.parse(req.body);

  await resetPassword(request);

  return clearAuthCookies(res)
    .status(OK)
    .json({ message: "Password was reset successfully" });
});
