import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { prisma } from "../lib/prisma";
import { send } from "process";

export const getTaskById = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
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
        column: true,
        project: true,
        tags: {
          include: {
            tag: true,
          },
        },
        checklists: true,
      },
    });

    if (!task) {
      sendError(res, "Task not found", 404);
      return;
    }

    const formattedTask = {
      ...task,
      assignees: task.assignees.map((a) => a.user),
      tags: task.tags ? task.tags.map((t) => t.tag) : null,
    };

    sendSuccess(res, formattedTask, "Task retrieved successfully.");
  } catch (error) {
    console.error("Error retrieving task:", error);
    sendError(res, "Failed to retrieve task.", 500, error);
  }
};

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

export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!existingTask) {
      sendError(res, "Task not found", 404);
      return;
    }
    await prisma.task.delete({
      where: { id: taskId },
    });
    sendSuccess(res, null, "Task deleted successfully.");
  } catch (error) {
    console.error("Error deleting task:", error);
    sendError(res, "Failed to delete task.", 500, error);
  }
};

export const updateMultipleTasks = async (req: Request, res: Response) => {
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
          data: task,
        })
      )
    );

    sendSuccess(res, updatedTasks, "Task updated successfully.");
  } catch (error) {
    sendError(res, "Failed to update task.", 500, error);
  }
};

export const updateSingleTask = async (req: Request, res: Response) => {
  try {
    const { task } = req.body;

    if (!task.id) {
      sendError(res, "Missing required field: task.id", 400);
      return;
    }

    const {
      id,
      title,
      description,
      priority,
      columnId,
      status,
      startDate,
      dueDate,
      timeEstimate,
      order,
      projectId,
      imgUrl,
    } = task;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        columnId,
        status,
        startDate,
        dueDate,
        timeEstimate,
        order,
        projectId,
        imgUrl,
        updatedAt: new Date(),
      },
    });

    sendSuccess(res, updatedTask, "Task details updated successfully.");
  } catch (error: any) {
    if (error.code === "P2025" || error.message?.includes("No record found")) {
      sendError(res, "Task not found", 404);
      return;
    }
    sendError(res, "Failed to update task details.", 500, error);
  }
};

export const updateTaskAssignees = async (req: Request, res: Response) => {
  try {
    const { taskId, userIds } = req.body as {
      taskId: string;
      userIds: string[];
    };

    if (!taskId || !Array.isArray(userIds)) {
      sendError(res, "Invalid request body", 400);
      return;
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      sendError(res, "Task not found", 404);
      return;
    }

    // Wrap delete and create in a transaction
    await prisma.$transaction([
      prisma.assignee.deleteMany({
        where: { taskId },
      }),
      ...(userIds.length > 0
        ? [
            prisma.assignee.createMany({
              data: userIds.map((userId) => ({
                taskId,
                userId,
              })),
              skipDuplicates: true,
            }),
          ]
        : []),
    ]);

    sendSuccess(res, null, "Task assignees updated successfully.");
  } catch (error) {
    console.error("Failed to update task assignees:", error);
    sendError(res, "Failed to update task assignees.", 500, error);
  }
};

export const getTaskAssignees = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      sendError(res, "Task not found", 404);
      return;
    }

    const assignees = await prisma.assignee.findMany({
      where: { taskId },
      include: {
        user: true,
      },
    });

    const formattedAssignees = assignees.map((a) => a.user);

    sendSuccess(
      res,
      formattedAssignees,
      "Task assignees retrieved successfully."
    );
  } catch (error) {
    console.error("Error retrieving task assignees:", error);
    sendError(res, "Failed to retrieve task assignees.", 500, error);
  }
};

export const linkTaskToTag = async (req: Request, res: Response) => {
  const { tagId } = req.body;
  const { taskId } = req.params;

  if (!taskId || !tagId) {
    sendError(res, "Missing required fields: taskId or tagId.", 400);
    return;
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      sendError(res, "Task not found.", 404);
      return;
    }

    const existingTag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!existingTag) {
      sendError(res, "Tag not found.", 404);
      return;
    }

    const existingLink = await prisma.taskTag.findFirst({
      where: { taskId, tagId },
    });

    if (existingLink) {
      sendError(res, "Task is already linked to this tag.", 400);
      return;
    }

    await prisma.taskTag.create({
      data: {
        taskId,
        tagId,
      },
    });

    sendSuccess(res, null, "Task linked to tag successfully.");
  } catch (error) {
    console.error("Error linking task to tag:", error);
    sendError(res, "Failed to link task to tag.", 500, error);
  }
};

export const unlinkTaskFromTag = async (req: Request, res: Response) => {
  try {
    const { taskId, tagId } = req.params;

    if (!taskId || !tagId) {
      sendError(res, "Missing required fields: taskId or tagId.", 400);
      return;
    }

    const existingLink = await prisma.taskTag.findFirst({
      where: { taskId, tagId },
    });

    if (!existingLink) {
      sendError(res, "Task is not linked to this tag.", 404);
      return;
    }

    await prisma.taskTag.delete({
      where: { id: existingLink.id },
    });

    sendSuccess(res, null, "Task unlinked from tag successfully.");
  } catch (error) {
    console.error("Error unlinking task from tag:", error);
    sendError(res, "Failed to unlink task from tag.", 500, error);
  }
};

export const unlinkAllTagsFromTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  if (!taskId) {
    sendError(res, "Missing required field: taskId.", 400);
    return;
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      sendError(res, "Task not found.", 404);
      return;
    }

    await prisma.taskTag.deleteMany({
      where: { taskId },
    });

    sendSuccess(res, null, "All tags unlinked from task successfully.");
  } catch (error) {
    console.error("Error unlinking all tags from task:", error);
    sendError(res, "Failed to unlink all tags from task.", 500, error);
  }
};

export const getTaskChecklists = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  if (!taskId) {
    sendError(res, "Missing required field: taskId.", 400);
    return;
  }
  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        checklists: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!existingTask) {
      sendError(res, "Task not found.", 404);
      return;
    }

    sendSuccess(
      res,
      existingTask.checklists,
      "Checklists retrieved successfully."
    );
  } catch (error) {
    console.error("Error retrieving task checklists:", error);
    sendError(res, "Failed to retrieve task checklists.", 500, error);
  }
};

export const createTaskChecklist = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  if (!taskId) {
    sendError(res, "Missing required fields taskId.", 400);
    return;
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      sendError(res, "Task not found.", 404);
      return;
    }

    const newChecklist = await prisma.checklist.create({
      data: {
        title: "New Checklist",
        taskId,
      },
    });

    sendSuccess(res, newChecklist, "Checklist created successfully.");
  } catch (error) {
    console.error("Error creating checklist:", error);
    sendError(res, "Failed to create checklist.", 500, error);
  }
};

export const updateTaskOrder = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { order: newOrder } = req.body;

  try {
    if (!taskId || newOrder === undefined) {
      sendError(res, "Missing required fields: taskId or order.", 400);
      return;
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      sendError(res, "Task not found.", 404);
      return;
    }

    const overlappingTasks = await prisma.task.findFirst({
      where: {
        projectId: existingTask.projectId,
        order: newOrder,
      },
    });

    if (!overlappingTasks) {
      sendError(res, "No task found with the specified order.", 404);
      return;
    }

    await prisma.task.update({
      where: { id: overlappingTasks.id },
      data: { order: existingTask.order },
    });

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { order: newOrder },
    });

    sendSuccess(res, updatedTask, "Task order updated successfully.");
  } catch (error) {
    console.error("Error updating task order:", error);
    sendError(res, "Failed to update task order.", 500, error);
  }
};

type OrderList = {
  taskId: string;
  order: number;
};

export const updateTaskOrderByProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { order } = req.body;

  try {
    if (!projectId || !Array.isArray(order)) {
      sendError(res, "Missing required fields: projectId or order.", 400);
      return;
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      sendError(res, "Project not found.", 404);
      return;
    }

    const updatedTasks = await prisma.$transaction(
      order.map((item: OrderList) =>
        prisma.task.update({
          where: { id: item.taskId },
          data: { order: item.order },
        })
      )
    );

    sendSuccess(res, updatedTasks, "Task orders updated successfully.");
  } catch (error) {
    console.error("Error updating task orders by project:", error);
    sendError(res, "Failed to update task orders by project.", 500, error);
  }
};

export const updateTaskOrderByColumn = async (req: Request, res: Response) => {
  const { columnId } = req.params;
  const { order } = req.body;

  try {
    if (!columnId || !Array.isArray(order)) {
      sendError(res, "Missing required fields: columnId or order.", 400);
      return;
    }

    const existingColumn = await prisma.column.findUnique({
      where: { id: columnId },
    });

    if (!existingColumn) {
      sendError(res, "Column not found.", 404);
      return;
    }

    const updatedTasks = await prisma.$transaction(
      order.map((item: OrderList) =>
        prisma.task.update({
          where: { id: item.taskId },
          data: { order: item.order, columnId },
        })
      )
    );

    sendSuccess(res, updatedTasks, "Task orders updated successfully.");
  } catch (error) {
    console.error("Error updating task orders by column:", error);
    sendError(res, "Failed to update task orders by column.", 500, error);
  }
};

export const updateTaskColumnId = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { columnId } = req.body;

  if (!taskId || !columnId) {
    sendError(res, "Missing required fields: taskId or columnId.", 400);
    return;
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      sendError(res, "Task not found.", 404);
      return;
    }

    const existingColumn = await prisma.column.findUnique({
      where: { id: columnId },
      include: {
        tasks: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!existingColumn) {
      sendError(res, "Column not found.", 404);
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { columnId, order: existingColumn.tasks.length + 1 },
    });

    sendSuccess(res, updatedTask, "Task column ID updated successfully.");
  } catch (error) {
    console.error("Error updating task column ID:", error);
    sendError(res, "Failed to update task column ID.", 500, error);
  }
};
