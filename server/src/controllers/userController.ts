import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { sendError, sendSuccess } from "../utils/response";

export const getUserTeams = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      sendError(res, "User ID is required", 400);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    sendSuccess(res, teams, "Teams retrieved successfully");
  } catch (error) {
    console.error("Error retrieving user teams:", error);
    sendError(res, "Failed to retrieve user teams", 500, error);
  }
};
