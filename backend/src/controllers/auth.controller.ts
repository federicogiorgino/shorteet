import { CREATED } from "../constants/http";
import { registerSchema } from "../schemas/auth.schemas";
import { createAccount } from "../services/auth.service";
import catchErrors from "../utils/catch-errors";
import { setAuthCookies } from "../utils/cookies";

export const registerHandler = catchErrors(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { user, accessToken, refreshToken } = await createAccount(request);

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});
