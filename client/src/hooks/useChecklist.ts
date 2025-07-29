import { queryClient } from "@/lib/queryClient";
import {
  createChecklistItem,
  deleteChecklistItem,
  getChecklistById,
} from "@/services/checklistServices";
import type { ErrorResponse } from "@/types/global.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useGetChecklistById = (checklistId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["getChecklistById", checklistId],
    queryFn: async () => {
      const res = await getChecklistById(checklistId);
      return res.data.data;
    },
    enabled,
  });
};

export const useCreateQuickChecklistItem = () => {
  return useMutation({
    mutationKey: ["createQuickChecklistItem"],
    mutationFn: async (checklistId: string) => {
      const title = "New Item";
      const res = await createChecklistItem(checklistId, title);
      return res.data.data;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Error create checklist item: ${error.response?.data.message || "Unknown error"}`,
      );
    },
    onSuccess: (data) => {
      const checklistId = data.checklistId;
      queryClient.invalidateQueries({
        queryKey: ["getChecklistById", checklistId],
      });
    },
  });
};

export const useDeleteChecklistItem = () => {
  return useMutation({
    mutationKey: ["deleteChecklistItem"],
    mutationFn: async ({
      checklistId,
      itemId,
    }: {
      checklistId: string;
      itemId: string;
    }) => {
      const res = await deleteChecklistItem(checklistId, itemId);
      return res.data.data;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Error deleting checklist item: ${error.response?.data.message || "Unknown error"}`,
      );
    },
    onSuccess: (data) => {
      const checklistId = data.checklistId;
      queryClient.invalidateQueries({
        queryKey: ["getChecklistById", checklistId],
      });
    },
  });
};
