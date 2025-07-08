import { axiosClient as axios } from "@/lib/axios";
import type { Column } from "@/types/column";
import type { BaseResponse } from "@/types/global.types";
import type { Project, ProjectCreatePayload } from "@/types/project";
import type { Task } from "@/types/task";

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
