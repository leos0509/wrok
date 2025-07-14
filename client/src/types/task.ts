import type { User } from "./user";

export type Task = {
  id: string;
  projectId: string;
  columnId: string;
  title: string;
  description?: string;
  position: number;
  imgUrl?: string;
  startDate?: string;
  dueDate?: string;

  createdAt: string;
  updatedAt: string;

  assignees?: User[];
};

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
