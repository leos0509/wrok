export type Column = {
  id: string;
  projectId: string;
  name: string;
  description?: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export type ColumnCreatePayload = {
  projectId: string;
  name: string;
  description?: string | null;
  color?: string | null;
};

export type ColumnUpdatePayload = {
  columns: Column[];
};
