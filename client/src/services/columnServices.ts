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
  payload: ColumnUpdatePayload[],
): Promise<{ data: BaseResponse<Column[]> }> => {
  try {
    const res = await axios.put(`/columns`, { columnMap: payload });
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
