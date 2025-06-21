import { axiosClient as axios } from "@/lib/axios";
import type { BaseResponse } from "@/types/global.types";
import type { Team } from "@/types/team";

export const getUserTeams = async (userId: string): Promise<{data: BaseResponse<Team[]>}> => {
  try {
    const res = await axios.get(`/users/${userId}/teams`);
    return res;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
