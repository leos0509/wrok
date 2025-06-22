import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createInitialColumnForProject } from "../utils/helper";
import { sendError, sendSuccess } from "../utils/response";

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

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany();

    sendSuccess(res, projects, "Projects retrieved successfully");
  } catch (error) {
    console.error("Error retrieving projects:", error);
    sendError(res, "Failed to retrieve projects", 500, error);
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = res.locals.userId;

    if (!userId) {
      sendError(res, "User ID is required", 400);
      return;
    }

    const teamProject = await prisma.teamProject.findFirst({
      where: {
        projectId: id,
        team: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    });

    if (!teamProject) {
      sendError(res, "You do not have access to this project", 403);
      return;
    }

    if (!id) {
      sendError(res, "Project ID is required", 400);
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      sendError(res, "Project not found", 404);
      return;
    }

    sendSuccess(res, project, "Project retrieved successfully");
  } catch (error) {
    console.error("Error retrieving project:", error);
    sendError(res, "Failed to retrieve project", 500, error);
  }
}

export const getProjectColumns = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      sendError(res, "Project ID is required", 400);
      return;
    }

    const columns = await prisma.column.findMany({
      where: { projectId },
      orderBy: { position: "asc" },
    });

    sendSuccess(res, columns, "Columns retrieved successfully");
  } catch (error) {
    console.error("Error retrieving project columns:", error);
    sendError(res, "Failed to retrieve project columns", 500, error);
  }
}