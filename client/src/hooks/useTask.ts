import { queryClient } from "@/lib/queryClient";
import { createTask } from "@/services/taskServices";
import type { ErrorResponse } from "@/types/global.types";
import type { CreateTaskPayload } from "@/types/task";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useCreateQuickTask = () => {
  return useMutation({
    mutationKey: ["createQuickTask"],
    mutationFn: async ({
      projectId,
      columnId,
    }: {
      projectId: string;
      columnId: string;
    }) => {
      const payload: CreateTaskPayload = {
        projectId,
        columnId,
        title: "New Task",
        description: "",
        startDate: "",
        endDate: "",
      };
      return await createTask(payload);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error creating quick task:", error);
      toast.error(error.response?.data.message || "Failed to create task.");
    },
    onSuccess: (data) => {
      toast.success(data.data.message || "Task created successfully.");
      queryClient.invalidateQueries({ queryKey: ["columnTasks"] });
    },
  });
};
