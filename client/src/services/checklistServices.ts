import { axiosClient as axios } from "@/lib/axios";
import type { Checklist } from "@/types/checklist";
import type { BaseResponse } from "@/types/global.types";

export const getChecklistById = async (
  checklistId: string,
): Promise<{ data: BaseResponse<Checklist> }> => {
  try {
    const res = await axios.get(`/checklists/${checklistId}`);
    return res;
  } catch (error) {
    console.error("Error fetching checklist by ID:", error);
    throw error;
  }
};
