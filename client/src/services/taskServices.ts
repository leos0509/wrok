import { axiosClient as axios } from "@/lib/axios";
import type { Checklist } from "@/types/checklist";
import type { BaseResponse } from "@/types/global.types";
import type { CreateTaskPayload, Task } from "@/types/task";
import type { User } from "@/types/user";

export const getTaskById = async (
  taskId: string,
): Promise<{ data: BaseResponse<Task> }> => {
  try {
    const res = await axios.get(`/tasks/${taskId}`);
    return res;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};

export const createTask = async (
  payload: CreateTaskPayload,
): Promise<{ data: BaseResponse<Task> }> => {
  try {
    const res = await axios.post("/tasks", payload);
    return res;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTasks = async (
  tasks: Task[],
): Promise<{ data: BaseResponse<Task[]> }> => {
  try {
    const res = await axios.put("/tasks/update-multiple", { tasks });
    return res;
  } catch (error) {
    console.error("Error updating tasks:", error);
    throw error;
  }
};

export const updateSingleTask = async (
  task: Task,
): Promise<{ data: BaseResponse<Task> }> => {
  try {
    const res = await axios.put("/tasks/update-single", { task });
    return res;
  } catch (error) {
    console.error("Error updating single task:", error);
    throw error;
  }
};

export const updateTaskAssignees = async (
  taskId: string,
  userIds: string[],
): Promise<{ data: BaseResponse<null> }> => {
  try {
    const res = await axios.put(`/tasks/update-assignees`, { taskId, userIds });
    return res;
  } catch (error) {
    console.error("Error updating task assignees:", error);
    throw error;
  }
};

export const getTaskAssignees = async (
  taskId: string,
): Promise<{ data: BaseResponse<User[]> }> => {
  try {
    const res = await axios.get(`/tasks/${taskId}/assignees`);
    return res;
  } catch (error) {
    console.error("Error fetching task assignees:", error);
    throw error;
  }
};

export const linkTaskToTag = async (
  taskId: string,
  tagId: string,
): Promise<{ data: BaseResponse<null> }> => {
  try {
    const res = await axios.post(`/tasks/${taskId}/tags`, { tagId });
    return res;
  } catch (error) {
    console.error("Error linking task to tag:", error);
    throw error;
  }
};

export const unlinkTaskFromTag = async (
  taskId: string,
  tagId: string,
): Promise<{ data: BaseResponse<null> }> => {
  try {
    const res = await axios.delete(`/tasks/${taskId}/tags/${tagId}`);
    return res;
  } catch (error) {
    console.error("Error unlinking task from tag:", error);
    throw error;
  }
};

export const unlinkAllTaskTags = async (
  taskId: string,
): Promise<{ data: BaseResponse<null> }> => {
  try {
    const res = await axios.delete(`/tasks/${taskId}/tags`);
    return res;
  } catch (error) {
    console.error("Error removing all task tags:", error);
    throw new Error("Failed to remove all task tags");
  }
};

export const deleteTask = async (
  taskId: string,
): Promise<{ data: BaseResponse<null> }> => {
  try {
    const res = await axios.delete(`/tasks/${taskId}`);
    return res;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const getTaskChecklists = async (
  taskId: string,
): Promise<{ data: BaseResponse<Checklist[]> }> => {
  try {
    const res = await axios.get(`/tasks/${taskId}/checklists`);
    return res;
  } catch (error) {
    console.error("Error fetching task checklists:", error);
    throw error;
  }
};

export const createTaskChecklist = async (
  taskId: string,
): Promise<{ data: BaseResponse<Checklist> }> => {
  try {
    const res = await axios.post(`/tasks/${taskId}/checklists`);
    return res;
  } catch (error) {
    console.error("Error adding checklist to task:", error);
    throw error;
  }
};
