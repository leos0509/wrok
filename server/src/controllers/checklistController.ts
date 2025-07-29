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
        items: {
          orderBy: {
            createdAt: "asc",
          }
        } 
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


export const createChecklistItem = async (req: Request, res: Response) => {
  const { checklistId } = req.params;
  const { title } = req.body;

  if (!checklistId || !title) {
    sendError(res, "Checklist ID and title are required.", 400);
    return;
  }

  try {
    const newItem = await prisma.checklistItem.create({
      data: {
        title,
        checklistId
      },
    });

    sendSuccess(res, newItem, "Checklist item created successfully");
  } catch (error) {
    console.error("Error creating checklist item:", error);
    sendError(res, "Failed to create checklist item.", 500, error);
  }
}

export const deleteChecklistItem = async (req: Request, res: Response) => {
  const { checklistId, itemId } = req.params;

  if (!checklistId || !itemId) {
    sendError(res, "Checklist ID and item ID are required.", 400);
    return;
  }

  try {
    const deletedItem = await prisma.checklistItem.delete({
      where: {
        id: itemId,
        checklistId: checklistId,
      },
    });

    sendSuccess(res, deletedItem, "Checklist item deleted successfully");
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    sendError(res, "Failed to delete checklist item.", 500, error);
  }
}
