import { axiosClient as axios } from "@/lib/axios";
import type { Checklist, ChecklistItem } from "@/types/checklist";
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

export const createChecklistItem = async (
  checklistId: string,
  title: string,
): Promise<{ data: BaseResponse<ChecklistItem> }> => {
  try {
    const res = await axios.post(`/checklists/${checklistId}/items`, { title });
    return res;
  } catch (error) {
    console.error("Error creating checklist item:", error);
    throw error;
  }
};

export const deleteChecklistItem = async (
  checklistId: string,
  itemId: string,
): Promise<{ data: BaseResponse<ChecklistItem> }> => {
  try {
    const res = await axios.delete(
      `/checklists/${checklistId}/items/${itemId}`,
    );
    return res;
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    throw error;
  }
};

export const updateChecklistItem = async (
  itemId: string,
  title: string,
  isChecked: boolean,
): Promise<{ data: BaseResponse<ChecklistItem> }> => {
  try {
    const res = await axios.put(`/checklist-items/${itemId}`, {
      title,
      isChecked,
    });
    return res;
  } catch (error) {
    console.error("Error updating checklist item:", error);
    throw error;
  }
};
