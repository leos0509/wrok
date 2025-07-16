import { axiosClient as axios } from "@/lib/axios";
import type { BaseResponse } from "@/types/global.types";
import type { CreateTaskPayload, Task } from "@/types/task";

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