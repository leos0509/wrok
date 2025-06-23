import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { prisma } from "../lib/prisma";
import { send } from "process";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { projectId, columnId, title, description, startDate, endDate } =
      req.body;

    if (!projectId || !columnId || !title) {
      sendError(
        res,
        "Missing required fields: projectId, columnId, or title.",
        400
      );
      return;
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      sendError(res, "Project not found.", 404);
      return;
    }

    const existingColumn = await prisma.column.findUnique({
      where: { id: columnId },
    });

    const existingColumnTasks = await prisma.task.findMany({
        where: { columnId },
        orderBy: { position: "asc" },
    });

    if (!existingColumn) {
      sendError(res, "Column not found.", 404);
      return;
    }

    const newTask = await prisma.task.create({
      data: {
        projectId,
        columnId,
        title,
        description,
        position: existingColumnTasks.length + 1,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    sendSuccess(res, newTask, "Task created successfully.");
  } catch (error) {
    sendError(res, "Failed to create task.", 500, error);
  }
};
