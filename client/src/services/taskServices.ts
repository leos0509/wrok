import { axiosClient as axios } from "@/lib/axios";
import type { BaseResponse } from "@/types/global.types";
import type { CreateTaskPayload, Task, UpdateTaskPositionPayload } from "@/types/task";

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

export const updateTaskPostion = async (
  payload: UpdateTaskPositionPayload[],
): Promise<{ data: BaseResponse<Task[]> }> => {
  try {
    const res = await axios.put("/tasks/update-position", payload);
    return res;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}