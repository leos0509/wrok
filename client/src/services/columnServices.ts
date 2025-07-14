import { axiosClient as axios } from "@/lib/axios";
import type { BaseResponse } from "@/types/global.types";
import type {
  Column,
  ColumnCreatePayload,
  ColumnUpdatePayload,
} from "@/types/column";
import type { Task } from "@/types/task";

export const createColumn = async (
  payload: ColumnCreatePayload,
): Promise<{ data: BaseResponse<Column> }> => {
  try {
    const res = await axios.post(`/columns`, payload);
    return res;
  } catch (error) {
    console.error("Error creating column:", error);
    throw error;
  }
};

export const updateColumns = async (
  payload: ColumnUpdatePayload,
): Promise<{ data: BaseResponse<Column[]> }> => {
  try {
    const res = await axios.put(`/columns`, payload);
    return res;
  } catch (error) {
    console.error("Error updating columns:", error);
    throw error;
  }
};

export const getColumnTasks = async (
  columnId: string,
): Promise<{ data: BaseResponse<Task[]> }> => {
  try {
    const res = await axios.get(`/columns/${columnId}/tasks`);
    return res;
  } catch (error) {
    console.error("Error fetching column tasks:", error);
    throw error;
  }
};

export const getColumnTaskAmount = async (
  id: string,
): Promise<{ data: BaseResponse<number> }> => {
  try {
    const res = await axios.get(`/columns/${id}/task-amount`);
    return res;
  } catch (error) {
    console.error("Error fetching column task amount:", error);
    throw error;
  }
}

export const deleteColumn = async (
  columnId: string,
): Promise<{ data: BaseResponse<null> }> => {
  try {
    const res = await axios.delete(`/columns/${columnId}`);
    return res;
  } catch (error) {
    console.error("Error deleting column:", error);
    throw error;
  }
}