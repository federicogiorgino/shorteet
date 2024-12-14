import { NOT_FOUND, OK } from "../constants/http";
import UserModel from "../models/user.model";
import appAssert from "../utils/app-assert";
import catchErrors from "../utils/catch-errors";

export const getUserController = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);

  appAssert(user, NOT_FOUND, "User not found");

  return res.status(OK).json(user.omitPassword());
});
