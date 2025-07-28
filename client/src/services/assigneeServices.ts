import { axiosClient as axios } from "@/lib/axios";
import type { AddAsigneePayload, RemoveAsigneePayload } from "@/types/assignee";
import type { BaseResponse } from "@/types/global.types";
import type { Task } from "@/types/task";

export const addAssignee = async (payload: AddAsigneePayload): Promise<{ data: BaseResponse<Task> }> => {
  try {
    const res = await axios.post(`/assignees/add`, payload);
    return res;
  } catch (error) {
    console.error("Error adding assignee:", error);
    throw error;
  }
};

export const removeAssignee = async (payload: RemoveAsigneePayload): Promise<{ data: BaseResponse<Task> }> => {
  try {
    const res = await axios.post(`/assignees/remove`, payload);
    return res;
  } catch (error) {
    console.error("Error remove assignee:", error);
    throw error;
  }
};

