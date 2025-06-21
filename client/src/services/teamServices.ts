import { axiosClient as axios } from "@/lib/axios";

export const createTeam = async (name: string) => {
  try {
    const res = await axios.post("/teams", { name });
    return res.data;
  } catch (error) {
    console.error("Error creating team:", error);
    throw new Error("Failed to create team");
  }
};
