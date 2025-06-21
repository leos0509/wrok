import { queryClient } from "@/lib/queryClient";
import { createTeam } from "@/services/teamServices";
import type { ErrorResponse } from "@/types/global.types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useCreateTeam = () => {
  return useMutation({
    mutationKey: ["createTeam"],
    mutationFn: async (name: string) => createTeam(name),
    onSuccess: (response) => {
      const { message } = response.data;
      toast.success(message || "Team create successful!");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["userTeams"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message || "Team create failed. Please try again.";
      toast.error(message);
      console.error("Team create error:", error);
    },
  });
};
