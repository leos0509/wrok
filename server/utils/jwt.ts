import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment");
}

export const generateToken = (
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "1h"
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = <T = any>(token: string): T => {
  return jwt.verify(token, JWT_SECRET) as T;
};
