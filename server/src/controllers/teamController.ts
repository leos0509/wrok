import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { prisma } from "../lib/prisma";

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = res.locals.userId;

    if (!name) {
      sendError(res, "Team name is required", 400);
      return;
    }

    const team = await prisma.team.create({
      data: {
        name,
      },
    });

    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: userId,
        isOwner: true,
      },
    });

    sendSuccess(res, team, "Team created successfully");
  } catch (error) {
    console.error("Error creating team:", error);
    sendError(res, "Failed to create team", 500);
  }
};
