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

export const getProjectsByTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const userId = res.locals.userId;

    if (!userId) {
      sendError(res, "User not authenticated", 401);
      return;
    }

    if (!teamId) {
      sendError(res, "teamId is required", 400);
      return;
    }

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: String(teamId),
        userId: String(userId),
      },
    });

    if (!teamMember) {
      sendError(res, "User is not a member of this team", 403);
      return;
    }

    const projects = await prisma.project.findMany({
      where: {
        teamProjects: {
          some: {
            teamId: String(teamId),
          },
        },
      },
    });

    sendSuccess(res, projects, "Projects retrieved successfully");
  } catch (error) {
    console.error("Error retrieving projects:", error);
    sendError(res, "Failed to retrieve projects", 500, error);
  }
};