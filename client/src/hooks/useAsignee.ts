import { queryClient } from "@/lib/queryClient";
import { addAssignee } from "@/services/assigneeServices";
import { useMutation } from "@tanstack/react-query";

export const useAddAssignee = () => {
  return useMutation({
    mutationKey: ["addAssignee"],
    mutationFn: async ({
      taskId,
      userId,
    }: {
      taskId: string;
      userId: string;
    }) => {
      const payload = { taskId, userId };
      return await addAssignee(payload);
    },
    onError: (error) => {
      console.error("Error adding assignee:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskDetails"] });
    },
  });
};

export const useRemoveAssignee = () => {
  return useMutation({
    mutationKey: ["removeAssignee"],
    mutationFn: async ({
      taskId,
      userId,
    }: {
      taskId: string;
      userId: string;
    }) => {
      const payload = { taskId, userId };
      return await addAssignee(payload);
    },
    onError: (error) => {
      console.error("Error removing assignee:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskDetails"] });
    },
  });
};
