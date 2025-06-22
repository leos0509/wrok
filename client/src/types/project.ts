export type ProjectCreatePayload = {
  name: string;
  description?: string | null;
  teamId: string;
}

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Column = {
  id: string;
  projectId: string;
  name: string;
  description?: string | null;
  color?: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
};
