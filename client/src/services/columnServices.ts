import { axiosClient as axios } from "@/lib/axios";
import type { BaseResponse } from "@/types/global.types";
import type { Column, ColumnCreatePayload } from "@/types/project";

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
