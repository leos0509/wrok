import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/response";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    sendError(res, "No token provided", 401);
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT secret is not defined");
      sendError(res, "Internal server error", 500);
      return;
    }

    const decoded = jwt.verify(token, secret) as { userId: string };
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    sendError(res, "Invalid token", 401, error);
    return;
  }
};