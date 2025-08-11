import { queryClient } from "@/lib/queryClient";
import {
  addMemberToProject,
  createProject,
  getProjectById,
  getProjectColumns,
  getProjectMembers,
  getProjectTags,
  getProjectTasks,
} from "@/services/projectServices";
import type { Column } from "@/types/column";
import type { ErrorResponse } from "@/types/global.types";
import type { ProjectCreatePayload } from "@/types/project";
import type { Task } from "@/types/task";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import { toast } from "sonner";

export const useCreateProject = () => {
  return useMutation({
    mutationKey: ["createProject"],
    mutationFn: async (payload: ProjectCreatePayload) => createProject(payload),
    onSuccess: (response) => {
      const { message } = response.data;
      toast.success(message || "Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["teamProjects"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message ||
        "Project creation failed. Please try again.";
      toast.error(message);
      console.error("Project creation error:", error);
    },
  });
};

export const useGetProjectById = (projectId: string) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => getProjectById(projectId),
    enabled: !!projectId,
    select: (data) => data.data.data,
  });

  useEffect(() => {
    if (query.isError) {
      const err = query.error as AxiosError<ErrorResponse>;
      toast.error(err.response?.data.message || "Error loading project");
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetProjectColumns = (projectId: string, enabled: boolean) => {
  const query = useQuery({
    queryKey: ["projectColumns", projectId],
    queryFn: async () => {
      const response = await getProjectColumns(projectId);
      return response.data.data;
    },
    enabled,
  });

  if (query.isError) {
    const err = query.error as AxiosError<ErrorResponse>;
    toast.error(
      `${err.response?.data.message}` || "Error loading project columns",
    );
  }
  return query;
};

export const useGetProjectTasks = (projectId: string, enabled: boolean) => {
  const query = useQuery({
    queryKey: ["projectTasks", projectId],
    queryFn: async () => {
      const response = await getProjectTasks(projectId);
      return response.data.data;
    },
    enabled,
  });

  if (query.isError) {
    const err = query.error as AxiosError<ErrorResponse>;
    toast.error(
      `${err.response?.data.message}` || "Error loading project columns",
    );
  }
  return query;
};

export const useGetProjectMembers = (projectId: string, enabled: boolean) => {
  const query = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: async () => getProjectMembers(projectId),
    enabled,
    select: (data) => data.data.data,
  });

  if (query.isError) {
    const err = query.error as AxiosError<ErrorResponse>;
    toast.error(
      `${err.response?.data.message}` || "Error loading project members",
    );
  }
  return query;
};

export const useAddMemberToProject = () => {
  return useMutation({
    mutationKey: ["addMemberToProject"],
    mutationFn: async ({
      projectId,
      email,
    }: {
      projectId: string;
      email: string;
    }) => addMemberToProject(projectId, email),
    onSuccess: (response) => {
      const { message } = response.data;
      toast.success(message || "Member added to project successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectMembers"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message ||
        "Failed to add member to project. Please try again.";
      toast.error(message);
      console.error("Add member error:", error);
    },
  });
};

export const useGetProjectTags = (projectId: string, enabled: boolean) => {
  const query = useQuery({
    queryKey: ["projectTags", projectId],
    queryFn: async () => {
      const response = await getProjectTags(projectId);
      return response;
    },
    enabled,
    select: (data) => data.data.data,
  });
  return query;
};

export const useGetProjectBoard = (projectId: string, enabled: boolean) => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["projectBoardTasks", projectId],
        queryFn: async () => {
          const res = await getProjectTasks(projectId);
          return res.data.data;
        },
        enabled,
      },
      {
        queryKey: ["projectBoardColumns", projectId],
        queryFn: async () => {
          const res = await getProjectColumns(projectId);
          return res.data.data;
        },
        enabled,
      },
      {
        queryKey: ["projectBoardProject", projectId],
        queryFn: async () => {
          const res = await getProjectById(projectId);
          return res.data.data;
        },
      },
    ],
  });

  const [tasksQuery, columnsQuery, projectQuery] = results;

  return {
    tasksQuery,
    columnsQuery,
    projectQuery,
    isLoading: results.some((q) => q.isLoading),
    isError: results.some((q) => q.isError),
  };
};

export const useSetBoardTasksCache = (projectId: string) => {
  const queryClient = useQueryClient();

  return (tasks: Task[]) => {
    queryClient.setQueryData<Task[] | undefined>(
      ["projectBoardTasks", projectId],
      (oldData) => {
        if (oldData === tasks) return oldData;
        return tasks;
      },
    );
  };
};

export const useSetBoardColumnsCache = (projectId: string) => {
  const queryClient = useQueryClient();

  return (columns: Column[]) => {
    queryClient.setQueryData<Column[] | undefined>(
      ["projectBoardColumns", projectId],
      (oldData) => {
        if (oldData === columns) return oldData;
        return columns;
      },
    );
  };
};
