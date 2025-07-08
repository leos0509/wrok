import e, { Request, Response } from "express";
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
      orderBy: { position: "desc" },
    });

    const newColumn = await prisma.column.create({
      data: {
        projectId,
        name,
        description,
        color: color || "#89CFF0",
        position: lastColumn ? lastColumn.position + 1 : 0,
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
            position: column.position,
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

export const getColumnTasks = async (req: Request, res: Response) => {
  try {
    const { columnId } = req.params;

    if (!columnId) {
      sendError(res, "Column ID is required", 400);
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { columnId },
      orderBy: { position: "asc" },
    });

    sendSuccess(res, tasks, "Tasks retrieved successfully");
  } catch (error) {
    console.error("Error retrieving column tasks:", error);
    sendError(res, "Failed to retrieve column tasks", 500, error);
  }
};
