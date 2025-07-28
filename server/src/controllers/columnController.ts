import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { prisma } from "../lib/prisma";

export const createColumn = async (req: Request, res: Response) => {
  try {
    const { projectId, name, description, color } = req.body;

    if (!projectId || !name) {
      sendError(res, "Project ID and name are required.", 400);
      return;
    }

    const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(color);

    if (color && !isHex) {
      sendError(res, "Color must be a valid hex code.", 400);
      return;
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      sendError(res, "Project not found.", 404);
      return;
    }

    const lastColumn = await prisma.column.findFirst({
      where: { projectId },
      orderBy: { order: "desc" },
    });

    const newColumn = await prisma.column.create({
      data: {
        projectId,
        name,
        description,
        color: color || "#89CFF0",
        order: lastColumn ? lastColumn.order + 1 : 1,
      },
    });

    sendSuccess(res, newColumn, "Column created successfully.");
  } catch (error) {
    console.error("Error creating column:", error);
    sendError(res, "Failed to create column.", 500);
  }
};

export const updateColumns = async (req: Request, res: Response) => {
  try {
    const { columns } = req.body;

    if (!columns || !Array.isArray(columns)) {
      console.error("Invalid columns data:", columns);
      sendError(res, "Invalid columns data.", 400);
      return;
    }

    const updatedColumns = await prisma.$transaction(
      columns.map((column: any) =>
        prisma.column.update({
          where: { id: column.id },
          data: {
            name: column.name,
            description: column.description,
            color: column.color,
          },
        })
      )
    );

    sendSuccess(res, updatedColumns, "Columns updated successfully.");
  } catch (error) {
    console.error("Error updating columns:", error);
    sendError(res, "Failed to update columns.", 500);
  }
};

export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { columnId } = req.params;

    if (!columnId) {
      sendError(res, "Column ID is required", 400);
      return;
    }

    const column = await prisma.column.findUnique({
      where: { id: columnId },
    });

    if (!column) {
      sendError(res, "Column not found", 404);
      return;
    }

    await prisma.column.delete({
      where: { id: columnId },
    }),
      sendSuccess(res, null, "Column deleted successfully.");
  } catch (error) {
    console.error("Error delete column:", error);
    sendError(res, "Failed to delete column.", 500, error);
  }
};

export const getColumnTasks = async (req: Request, res: Response) => {
  try {
    const { columnId } = req.params;

    if (!columnId) {
      sendError(res, "Column ID is required", 400);
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { columnId },
      include: {
        assignees: {
          select: {
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        checklists: true,
      },
    });

    const formattedTasks = tasks.map((task) => ({
      ...task,
      assignees: task.assignees.map((a) => a.user),
      tags: task.tags ? task.tags.map((t) => t.tag) : null,
    }));

    sendSuccess(res, formattedTasks, "Tasks retrieved successfully");
  } catch (error) {
    console.error("Error retrieving column tasks:", error);
    sendError(res, "Failed to retrieve column tasks", 500, error);
  }
};

