import type { Column } from "./column";
import type { Tag } from "./tag";
import type { Task } from "./task";

export type ProjectCreatePayload = {
  name: string;
  description?: string | null;
  teamId: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;

  tags?: Tag[];
  columns?: Column[];
};

export type Board = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;

  projectId: string;

  columns: Column[];
  tasks: Task[];
}

export type BoardEntities = Record<string, Board>;

export type ProjectEntities = Record<string, Project>;

export type ProjectBoard = {
  project: Project;
  columns: Column[];
  tasks: Task[];
}