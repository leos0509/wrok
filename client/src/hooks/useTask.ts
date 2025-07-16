import { queryClient } from "@/lib/queryClient";
import { createTask, updateTasks } from "@/services/taskServices";
import type { ErrorResponse } from "@/types/global.types";
import type { CreateTaskPayload, Task } from "@/types/task";
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
        dueDate: "",
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

export const useUpdateTasks = () => {
  return useMutation({
    mutationKey: ["updateTasks"],
    mutationFn: async (tasks: Task[]) => updateTasks(tasks),
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error updating tasks:", error);
      toast.error(error.response?.data.message || "Failed to update tasks.");
    },
  });
}

export const useCreateTask = () => {
  return useMutation({
    mutationKey: ["createTask"],
    mutationFn: async (payload: CreateTaskPayload) => {
      return await createTask(payload);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error creating task:", error);
      toast.error(error.response?.data.message || "Failed to create task.");
    },
    onSuccess: (data) => {
      toast.success(data.data.message || "Task created successfully.");
      queryClient.invalidateQueries({ queryKey: ["columnTasks"] });
    },
  });
}