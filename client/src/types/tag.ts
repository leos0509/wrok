import type { TaskTag } from "./task";

export type Tag = {
    id: string;
    name: string;
    
    createdAt: string;
    updatedAt: string;

    tasks?: TaskTag[];
}