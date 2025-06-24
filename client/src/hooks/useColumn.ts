import { queryClient } from "@/lib/queryClient";
import {
  createColumn,
  getColumnTaskAmount,
  getColumnTasks,
  updateColumns,
} from "@/services/columnServices";
import type { ErrorResponse } from "@/types/global.types";
import type { ColumnCreatePayload, ColumnUpdatePayload } from "@/types/column";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useCreateColumn = () => {
  return useMutation({
    mutationKey: ["createColumn"],
    mutationFn: async (payload: ColumnCreatePayload) => createColumn(payload),
    onSuccess: (data) => {
      console.log("Column created successfully:", data);
      toast.success("Column created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectColumns"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Error creating column: ${error.response?.data.message || "Unknown error"}`,
      );
    },
  });
};

export const useUpdateColumn = () => {
  return useMutation({
    mutationKey: ["updateColumn"],
    mutationFn: async (payload: ColumnUpdatePayload[]) =>
      updateColumns(payload),
    onSuccess: (data) => {
      console.log("Column updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["projectColumns"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Error updating column: ${error.response?.data.message || "Unknown error"}`,
      );
    },
  });
};

export const useGetColumnTasks = (columnId: string) => {
  const query = useQuery({
    queryKey: ["columnTasks", columnId],
    queryFn: async () => getColumnTasks(columnId),
    enabled: !!columnId,
    select: (data) => data.data.data,
  });

  if (query.isError) {
    const err = query.error as AxiosError<ErrorResponse>;
    toast.error(
      `Error fetching column tasks: ${err.response?.data.message || "Unknown error"}`,
    );
  }

  return query;
};

export const useGetColumnTaskAmount = (id: string) => {
  return useQuery({
    queryKey: ["columnTaskAmount", id],
    queryFn: async () => getColumnTaskAmount(id),
    enabled: !!id,
    select: (data) => data.data.data,
  });
}