type SuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
};

type ErrorResponse = {
  success: false;
  message: string;
  error?: any;
};

export const sendSuccess = <T>(
  res: import("express").Response,
  data: T,
  message = "OK",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  } satisfies SuccessResponse<T>);
};

export const sendError = (
  res: import("express").Response,
  message: string,
  statusCode = 400,
  error: any = undefined
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  } satisfies ErrorResponse);
};
