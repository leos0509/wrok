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
    const { columnMap } = req.body;

    if (!Array.isArray(columnMap) || columnMap.length === 0) {
      sendError(res, "Invalid column data", 400);
      return;
    }

    for (const col of columnMap) {
      if (typeof col.id !== "string" || typeof col.position !== "number") {
        sendError(
          res,
          "Each column must have a valid 'id' and 'position'",
          400
        );
        return;
      }
    }

    const existingColumns = await prisma.column.findMany({
      where: {
        id: { in: columnMap.map((col) => col.id) },
      },
      select: { id: true },
    });

    const existingIds = new Set(existingColumns.map((col) => col.id));
    const invalidIds = columnMap
      .filter((col) => !existingIds.has(col.id))
      .map((col) => col.id);

    if (invalidIds.length > 0) {
      sendError(
        res,
        `Some columns do not belong to this project: ${invalidIds.join(", ")}`,
        404
      );
      return;
    }

    const updateOperations = columnMap.map((col) =>
      prisma.column.update({
        where: { id: col.id },
        data: { position: col.position },
      })
    );

    const updatedColumns = await prisma.$transaction(updateOperations);

    sendSuccess(res, updatedColumns, "Columns updated successfully");
  } catch (error) {
    console.error("Error updating project columns:", error);
    sendError(res, "Failed to update project columns", 500, error);
  }
};