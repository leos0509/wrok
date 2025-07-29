import { updateChecklistItem } from "@/services/checklistItemServices";
import type { ErrorResponse } from "@/types/global.types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useUpdateChecklistItem = () => {
  return useMutation({
    mutationKey: ["updateChecklistItem"],
    mutationFn: async ({
      itemId,
      title,
      isChecked,
    }: {
      itemId: string;
      title: string;
      isChecked: boolean;
    }) => {
      const res = await updateChecklistItem(itemId, title, isChecked);
      return res.data.data;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Error updating checklist item: ${error.response?.data.message || "Unknown error"}`,
      );
      console.error("Error updating checklist item:", error);
    },
  });
};
