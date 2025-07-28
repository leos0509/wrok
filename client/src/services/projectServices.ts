import { axiosClient as axios } from "@/lib/axios";
import type { Column } from "@/types/column";
import type { BaseResponse } from "@/types/global.types";
import type { Project, ProjectCreatePayload } from "@/types/project";
import type { Tag } from "@/types/tag";
import type { Task } from "@/types/task";
import type { User } from "@/types/user";

export const createProject = async (
  payload: ProjectCreatePayload,
): Promise<{ data: BaseResponse<Project> }> => {
  try {
    const res = await axios.post("/projects", payload);
    return res;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }
};

export const getProjectById = async (
  projectId: string,
): Promise<{
  data: BaseResponse<Project>;
}> => {
  try {
    const res = await axios.get(`/projects/${projectId}`);
    return res;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
};

export const getProjectColumns = async (
  projectId: string,
): Promise<{ data: BaseResponse<Column[]> }> => {
  try {
    const res = await axios.get(`/projects/${projectId}/columns`);
    return res;
  } catch (error) {
    console.error("Error fetching project columns at service:", error);
    throw error;
  }
};

export const getProjectTasks = async (
  projectId: string,
): Promise<{ data: BaseResponse<Task[]> }> => {
  try {
    const res = await axios.get(`/projects/${projectId}/tasks`);
    return res;
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    throw error;
  }
};

export const getProjectMembers = async (
  projectId: string,
): Promise<{ data: BaseResponse<User[]> }> => {
  try {
    const res = await axios.get(`/projects/${projectId}/members`);
    return res;
  } catch (error) {
    console.error("Error fetching project members:", error);
    throw error;
  }
};

export const addMemberToProject = async (
  projectId: string,
  email: string,
): Promise<{ data: BaseResponse<User> }> => {
  try {
    const res = await axios.post(`/projects/${projectId}/member`, { email });
    return res;
  } catch (error) {
    console.error("Error adding member to project:", error);
    throw error;
  }
};

export const getProjectTags = async (
  projectId: string,
): Promise<{ data: BaseResponse<Tag[]> }> => {
  try {
    const res = await axios.get(`/projects/${projectId}/tags`);
    return res;
  } catch (error) {
    console.error("Error fetching project tags:", error);
    throw error;
  }
};