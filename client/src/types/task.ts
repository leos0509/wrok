import type { User } from "./user"

export type Task = {
    id: string,
    projectId: string,
    columnId: string,
    title: string,
    description?: string,
    position: number,
    imgUrl?: string,
    startDate?: string,
    endDate?: string,

    createdAt: string,
    updatedAt: string,

    assignees?: User[]
}