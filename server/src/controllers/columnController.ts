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
        orderBy: { position: "desc" },
    });

    const newColumn = await prisma.column.create({
      data: {
        projectId,
        name,
        description,
        color: "#89CFF0",
        position: lastColumn ? lastColumn.position + 1 : 0,
      },
    });

    sendSuccess(res, newColumn, "Column created successfully.");
  } catch (error) {
    console.error("Error creating column:", error);
    sendError(res, "Failed to create column.", 500);
  }
};
