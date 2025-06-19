import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "OK",
  statusCode = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  error?: any
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
