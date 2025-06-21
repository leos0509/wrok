import { getUserTeams } from "@/services/userServices";
import { useQuery } from "@tanstack/react-query";

export const useGetUserTeams = (userId: string, enable: boolean) => {
  return useQuery({
    queryKey: ["userTeams", userId],
    queryFn: async () => getUserTeams(userId),
    enabled: enable,
    select: (data) => data.data.data,
  });
};
