import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { prisma } from "../lib/prisma";

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name, projectId } = req.body;

    if (!name || !projectId) {
      sendError(res, "Name and projectId are required", 400);
      return;
    }

    const newTag = await prisma.tag.create({
      data: {
        name,
        projectId,
      },
    });

    sendSuccess(res, newTag, "Tag created successfully");
  } catch (error) {
    console.error("Error creating tag:", error);
    sendError(res, "Failed to create tag", 500, error);
  }
};