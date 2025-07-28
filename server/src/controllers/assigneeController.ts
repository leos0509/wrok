import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { prisma } from "../lib/prisma";

export const addAssignee = async (req: Request, res: Response) => {
  try {
    const { taskId, userId } = req.body;

    if (!taskId || !userId) {
      sendError(res, "Task ID and User ID are required.", 400);
      return;
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignees: true },
    });

    if (!task) {
      sendError(res, "Task not found.", 404);
      return;
    }

    const existingAssignee = task.assignees.find(
      (assignee) => assignee.id === userId
    );

    if (existingAssignee) {
      sendError(res, "User is already assigned to this task.", 400);
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        assignees: {
          connect: { id: userId },
        },
      },
    });

    sendSuccess(res, updatedTask, "Assignee added successfully.");
  } catch (error) {
    console.error("Error adding assignee:", error);
    sendError(res, "Failed to add assignee.", 500, error);
  }
};

export const removeAssignee = async (req: Request, res: Response) => {
  try {
    const { taskId, userId } = req.body;

    if (!taskId || !userId) {
      sendError(res, "Task ID and User ID are required.", 400);
      return;
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignees: true },
    });

    if (!task) {
      sendError(res, "Task not found.", 404);
      return;
    }

    const existingAssignee = task.assignees.find(
      (assignee) => assignee.id === userId
    );

    if (!existingAssignee) {
      sendError(res, "User is not assigned to this task.", 400);
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        assignees: {
          disconnect: { id: userId },
        },
      },
    });
    sendSuccess(res, updatedTask, "Assignee removed successfully.");
  } catch (error) {
    console.error("Error removing assignee:", error);
    sendError(res, "Failed to remove assignee.", 500, error);
  }
};
