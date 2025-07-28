import type { Checklist } from "./checklist";
import type { Column } from "./column";
import type { Project } from "./project";
import type { Tag } from "./tag";
import type { User } from "./user";

export type Task = {
  id: string;
  projectId: string;
  columnId: string;
  title: string;
  description?: string | null;
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
  timeEstimate?: number | null;
  imgUrl?: string | null;
  startDate?: string | null;
  dueDate?: string | null;

  createdAt: string;
  updatedAt: string;

  assignees?: User[];
  checklists?: Checklist[];
  tags?: Tag[] | null;

  project?: Project;
  column?: Column;
};

export type TaskTag = {
  id: string;
  taskId: string;
  tagId: string;

  createdAt: string;
  updatedAt: string;
};

export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "COMPLETED";

export type TaskPriority = "LOWEST" | "LOW" | "MEDIUM" | "HIGH" | "HIGHEST";

export type CreateTaskPayload = {
  projectId: string;
  columnId: string;
  title: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
};
