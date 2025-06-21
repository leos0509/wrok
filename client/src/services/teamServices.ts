import { axiosClient as axios } from "@/lib/axios";

export const getTeams = async (userId: string) => {
  try {
    const res = await axios.get(`/users/${userId}/teams`);

    return res;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error; // Re-throw the error for further handling
  }
};
