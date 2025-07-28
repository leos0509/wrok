import type { TaskTag } from "./task";

export type Tag = {
    id: string;
    name: string;
    projectId: string;
    
    createdAt: string;
    updatedAt: string;

    tasks?: TaskTag[];
}

export type CreateTagPayload = {
    name: string;
    projectId: string;
};