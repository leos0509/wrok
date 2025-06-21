import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { sendError, sendSuccess } from "../utils/response";
import { generateToken } from "../utils/jwt";
import { createInitialTeamForUser } from "../utils/helper";


export const signup = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  // Basic validation
  if (!email || !password || !firstName || !lastName) {
    sendError(res, "All fields are required", 400);
    return;
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    console.log("Existing user:", existingUser);

    if (existingUser) {
      sendError(res, "User already exists", 409);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    createInitialTeamForUser(newUser).catch((error) => {
      console.error("Failed to create initial team:", error);
      sendError(res, "Failed to create initial team", 500, error);
    });

    const newUserWithoutPassword = {
      ...newUser,
      password: undefined,
    };

    sendSuccess(res, newUserWithoutPassword, "User created successfully", 201);
  } catch (error) {
    console.error("Error during signup:", error);
    sendError(res, "Internal server error", 500, error);
    return;
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    sendError(res, "Email and password are required", 400);
    return;
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      sendError(res, "Invalid password", 401);
      return;
    }

    const token = generateToken({ userId: user.id }, "7d");

    const { password: _, ...userWithoutPassword } = user;

    // Successful signin
    sendSuccess(res, { token, user: userWithoutPassword }, "Signin successful");
  } catch (error) {
    console.error("Error during signin:", error);
    sendError(res, "Internal server error", 500, error);
    return;
  }
};
