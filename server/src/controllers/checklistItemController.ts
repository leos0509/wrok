import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { prisma } from "../lib/prisma";

export const updateChecklistItem = async (req: Request, res: Response) => {
  const { itemId } = req.params;
  const { title, isChecked } = req.body;

  if (!itemId) {
    sendError(res, "Checklist ID and item ID are required.", 400);
    return;
  }

  try {
    const updatedItem = await prisma.checklistItem.update({
      where: {
        id: itemId,
      },
      data: {
        title,
        isChecked,
      },
    });

    if (!updatedItem) {
      sendError(res, "Checklist item not found.", 404);
      return;
    }

    sendSuccess(res, updatedItem, "Checklist item updated successfully");
  } catch (error) {
    console.error("Error updating checklist item:", error);
    sendError(res, "Failed to update checklist item.", 500, error);
  }
};
