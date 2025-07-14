export type Checklist = {
    id: string;
    taskId: string;
    title: string;
    
    createdAt: string;
    updatedAt: string;

    items?: ChecklistItem[];
}

export type ChecklistItem = {
    id: string;
    checklistId: string;
    title: string;
    isChecked: boolean;

    createdAt: string;
    updatedAt: string;
}