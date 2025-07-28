import { queryClient } from "@/lib/queryClient";
import { createTag } from "@/services/tagServices";
import {
  createTask,
  createTaskChecklist,
  deleteTask,
  getTaskById,
  getTaskChecklists,
  linkTaskToTag,
  unlinkAllTaskTags,
  unlinkTaskFromTag,
  updateSingleTask,
  updateTaskAssignees,
  updateTasks,
} from "@/services/taskServices";
import type { ErrorResponse } from "@/types/global.types";
import type { CreateTagPayload } from "@/types/tag";
import type { CreateTaskPayload, Task } from "@/types/task";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useGetTaskById = (taskId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["getTaskById", taskId],
    queryFn: async () => {
      const res = await getTaskById(taskId);
      return res.data.data;
    },
    enabled,
  });
};

export const useGetTaskDetail = (taskId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["getTaskDetail", taskId],
    queryFn: async () => {
      const res = await getTaskById(taskId);
      return res.data.data;
    },
    enabled,
  });
};

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
};

export const useUpdateSingleTask = () => {
  return useMutation({
    mutationKey: ["updateSingleTask"],
    mutationFn: async (task: Task) => {
      return await updateSingleTask(task);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error updating single task:", error);
    },
    onSuccess: (data) => {
      const task = data.data.data;
      queryClient.invalidateQueries({ queryKey: ["getTaskById", task.id] });
    },
  });
};

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
};

export const useUpdateTaskAssignees = () => {
  return useMutation({
    mutationKey: ["updateTaskAssignees"],
    mutationFn: async ({
      taskId,
      assignees,
    }: {
      taskId: string;
      assignees: string[];
    }) => {
      return await updateTaskAssignees(taskId, assignees);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error updating task assignees:", error);
    },
  });
};

export const useGetTaskAssignees = (taskId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["getTaskAssignees", taskId],
    queryFn: async () => {
      const res = await getTaskById(taskId);
      return res.data.data.assignees;
    },
    enabled,
  });
};

export const useRemoveAllTaskAssignees = () => {
  return useMutation({
    mutationKey: ["removeAllTaskAssignees"],
    mutationFn: async (taskId: string) => {
      const res = await updateTaskAssignees(taskId, []);
      return res.data;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error removing all task assignees:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTaskAssignees"] });
    },
  });
};

export const useLinkTagToTask = () => {
  return useMutation({
    mutationKey: ["linkTagToTask"],
    mutationFn: async ({
      taskId,
      tagId,
    }: {
      taskId: string;
      tagId: string;
    }) => {
      const res = await linkTaskToTag(taskId, tagId);
      return res.data.data;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error linking task to tag:", error);
    },
  });
};

export const useUnlinkTagFromTask = () => {
  return useMutation({
    mutationKey: ["unlinkTagFromTask"],
    mutationFn: async ({
      taskId,
      tagId,
    }: {
      taskId: string;
      tagId: string;
    }) => {
      const res = await unlinkTaskFromTag(taskId, tagId);
      return res.data.data;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error unlinking task from tag:", error);
    },
  });
};

export const useCreateTag = () => {
  return useMutation({
    mutationKey: ["createTag"],
    mutationFn: async (payload: CreateTagPayload) => createTag(payload),
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error creating tag:", error);
    },
  });
};

export const useCreateAndLinkTag = () => {
  const createTagMutation = useCreateTag();
  const linkTagMutation = useLinkTagToTask();

  return useMutation({
    mutationKey: ["createAndLinkTag"],
    mutationFn: async ({
      taskId,
      tagName,
      projectId,
    }: {
      taskId: string;
      tagName: string;
      projectId: string;
    }) => {
      const tagPayload: CreateTagPayload = { name: tagName, projectId };
      const tagResponse = await createTagMutation.mutateAsync(tagPayload);
      const tagId = tagResponse.data.data.id;

      await linkTagMutation.mutateAsync({ taskId, tagId });
      return tagResponse.data;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error creating and linking tag:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTags"] });
    },
  });
};

export const useUnlinkAllTagsFromTask = () => {
  return useMutation({
    mutationKey: ["unlinkAllTagsFromTask"],
    mutationFn: async (taskId: string) => {
      const res = await unlinkAllTaskTags(taskId);
      return res.data.data;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error unlinking all tags from task:", error);
    },
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationKey: ["deleteTask"],
    mutationFn: async (taskId: string) => {
      const res = await deleteTask(taskId);
      return res.data.data;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error deleting task:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columnTasks"] });
    },
  });
};

export const useGetTaskChecklists = (taskId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["getTaskChecklists", taskId],
    queryFn: async () => {
      const res = await getTaskChecklists(taskId);
      return res.data.data;
    },
    enabled,
  });
};

export const useCreateTaskChecklist = () => {
  return useMutation({
    mutationKey: ["createTaskChecklist"],
    mutationFn: async (taskId: string) => {
      const res = await createTaskChecklist(taskId);
      return res.data.data;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error creating task checklist:", error);
    },
    onSuccess: (data) => {
      const taskId = data.taskId;
      queryClient.invalidateQueries({
        queryKey: ["getTaskChecklists", taskId],
      });
    },
  });
};
