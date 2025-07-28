import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { prisma } from "../lib/prisma";

export const getChecklist = async (req: Request, res: Response) => {
  const { checklistId } = req.params;

  if (!checklistId) {
    sendError(res, "Checklist ID is required.", 400);
    return;
  }
  try {
    const checklist = await prisma.checklist.findUnique({
      where: { id: checklistId },
      include: {
        items: true,
      },
    });

    if (!checklist) {
      sendError(res, "Checklist not found.", 404);
      return;
    }

    sendSuccess(res, checklist, "Checklist fetched successfully");
  } catch (error) {
    console.error("Error fetching checklists:", error);
    sendError(res, "Failed to fetch checklist.", 500, error);
  }
};
