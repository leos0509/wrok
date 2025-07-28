import { getChecklistById } from "@/services/checklistServices";
import { useQuery } from "@tanstack/react-query";

export const useGetChecklistById = (checklistId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["getChecklistById", checklistId],
    queryFn: async () => {
      const res = await getChecklistById(checklistId);
      return res.data.data;
    },
    enabled,
  });
};
