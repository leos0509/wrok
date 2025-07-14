import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createInitialColumnForProject, sanitizeUser } from "../utils/helper";
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
};

export const getProjectColumns = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      sendError(res, "Project ID is required", 400);
      return;
    }

    const columns = await prisma.column.findMany({
      where: { projectId },
    });

    sendSuccess(res, columns, "Columns retrieved successfully");
  } catch (error) {
    console.error("Error retrieving project columns:", error);
    sendError(res, "Failed to retrieve project columns", 500, error);
  }
};

export const getProjectTasks = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      sendError(res, "Project ID is required", 400);
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
    });

    sendSuccess(res, tasks, "Tasks retrieved successfully");
  } catch (error) {
    console.error("Error retrieving project tasks:", error);
    sendError(res, "Failed to retrieve project tasks", 500, error);
  }
};

export const getProjectMembers = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      sendError(res, "Project ID is required", 400);
      return;
    }

    const team = await prisma.team.findFirst({
      where: {
        projects: {
          some: {
            projectId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!team) {
      sendError(res, "Team not found for this project", 404);
      return;
    }

    const members = team.members.map((member) => member.user);

    const sanitizedMembers = members.map((user) => sanitizeUser(user));

    sendSuccess(
      res,
      sanitizedMembers,
      "Project members retrieved successfully"
    );
  } catch (error) {
    console.error("Error retrieving project members:", error);
    sendError(res, "Failed to retrieve project members", 500, error);
  }
};

export const addMemeberToProject = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const { projectId } = req.params;

    if (!projectId || !email) {
      sendError(res, "Project ID and email are required", 400);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    const team = await prisma.team.findFirst({
      where: {
        projects: {
          some: {
            projectId,
          },
        },
      },
    });

    if (!team) {
      sendError(res, "Team not found for this project", 404);
      return;
    }

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: team.id,
        userId: user.id,
      },
    });

    if (teamMember) {
      sendError(res, "User is already a member of this team", 400);
      return;
    }

    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: user.id,
      },
    });

    sendSuccess(res, sanitizeUser(user), "User added to project successfully");
  } catch (error) {
    console.error("Error adding member to project:", error);
    sendError(res, "Failed to add member to project", 500, error);
  }
};
