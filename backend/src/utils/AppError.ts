import { HttpStatusCode } from "../constants/http";

export const enum AppErrorCodeEnum {
  InvalidAccessToken = "InvalidAccessToken",
}

class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCodeEnum
  ) {
    super(message);
  }
}

export default AppError;
