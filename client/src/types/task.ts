import type { Checklist } from "./checklist";
import type { User } from "./user";

export type Task = {
  id: string;
  projectId: string;
  columnId: string;
  title: string;
  description?: string;
  position: number;
  status: TaskStatus;
  priority: TaskPriority;
  timeEstimate?: number;
  imgUrl?: string;
  startDate?: string;
  dueDate?: string;

  createdAt: string;
  updatedAt: string;

  assignees?: User[];
  checklists?: Checklist[];
  tags?: TaskTag[];
};

export type TaskTag = {
  id: string;
  taskId: string;
  tagId: string;

  createdAt: string;
  updatedAt: string;
};

export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOWEST" | "LOW" | "MEDIUM" | "HIGH" | "HIGHEST";

export type CreateTaskPayload = {
  projectId: string;
  columnId: string;
  title: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
};

export type UpdateTaskPositionPayload = {
  id: string;
  position: number;
};
