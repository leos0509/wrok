import { axiosClient as axios } from "@/lib/axios";
import type { BaseResponse } from "@/types/global.types";
import type { Project } from "@/types/project";

export const createTeam = async (name: string) => {
  try {
    const res = await axios.post("/teams", { name });
    return res.data;
  } catch (error) {
    console.error("Error creating team:", error);
    throw new Error("Failed to create team");
  }
};

export const getProjectsByTeam = async (teamId: string): Promise<{data: BaseResponse<Project[]>}> => {
  try {
    const res = await axios.get(`/teams/${teamId}/projects`);
    return res;
  } catch (error) {
    console.log("Error fetching projects by team:", error);
    throw new Error("Failed to fetch projects for the team");
  }
};