import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { sendError, sendSuccess } from "../utils/response";
import { create } from "domain";
import { createInitialColumnForProject } from "../utils/helper";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, teamId } = req.body;

    if (!name || !teamId) {
      sendError(res, "Name and teamId are required", 400);
      return;
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      sendError(res, "Team not found", 404);
      return;
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
      },
    });

    await prisma.teamProject.create({
      data: {
        projectId: project.id,
        teamId,
      },
    });

    createInitialColumnForProject(project.id).catch((error) => {
      console.error("Failed to create initial columns:", error);
      sendError(res, "Failed to create initial columns", 500, error);
    });

    sendSuccess(res, project, "Project created successfully", 201);
  } catch (error) {
    console.error("Error creating project:", error);
    sendError(res, "Failed to create project", 500, error);
  }
};

export const getProjectsByTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.query;
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
