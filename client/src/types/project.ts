import type { Tag } from "./tag";

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
};
