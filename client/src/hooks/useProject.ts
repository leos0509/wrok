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
import type { ErrorResponse } from "@/types/global.types";
import type { ProjectCreatePayload } from "@/types/project";
import { useMutation, useQuery } from "@tanstack/react-query";
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
    queryFn: async () => getProjectColumns(projectId),
    enabled,
    select: (data) => data.data.data,
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
      return response;
    },
    enabled,
    select: (data) => data.data.data,
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
}