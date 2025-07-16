import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { prisma } from "../lib/prisma";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { projectId, columnId, title, description, startDate, dueDate } =
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
      orderBy: { order: "asc" },
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
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        order: existingColumnTasks.length + 1, 
      },
    });

    sendSuccess(res, newTask, "Task created successfully.");
  } catch (error) {
    sendError(res, "Failed to create task.", 500, error);
  }
};

export const updateTasks = async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;

    for (const task of tasks) {
      if (!task.id || !task.title) {
        sendError(res, "Missing required fields: id or title.", 400);
        return;
      }

      const existingTask = await prisma.task.findUnique({
        where: { id: task.id },
      });
      if (!existingTask) {
        sendError(res, `Task with id ${task.id} not found.`, 404);
        return;
      }
    }

    const updatedTasks = await prisma.$transaction(
      tasks.map((task: any) =>
        prisma.task.update({
          where: { id: task.id },
          data: {
            title: task.title,
            description: task.description,
            startDate: task.startDate ? new Date(task.startDate) : null,
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
          },
        })
      )
    )

    sendSuccess(res, updatedTasks, "Task updated successfully.");
  } catch (error) {
    sendError(res, "Failed to update task.", 500, error);
  }
}