import { axiosClient as axios } from "@/lib/axios";
import type { BaseResponse } from "@/types/global.types";
import type { Project, ProjectCreatePayload } from "@/types/project";

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
    throw new Error("Failed to fetch project");
  }
};
