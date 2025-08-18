import { queryClient } from "@/lib/queryClient";
import {
  createColumn,
  deleteColumn,
  getColumnTaskAmount,
  getColumnTasks,
  updateColumnOrder,
  updateColumns,
} from "@/services/columnServices";
import { updateTaskColumnId } from "@/services/taskServices";
import type { ColumnCreatePayload, ColumnUpdatePayload } from "@/types/column";
import type { ErrorResponse } from "@/types/global.types";
import type { Task } from "@/types/task";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useCreateColumn = () => {
  return useMutation({
    mutationKey: ["createColumn"],
    mutationFn: async (payload: ColumnCreatePayload) => createColumn(payload),
    onSuccess: (data) => {
      console.log("Column created successfully:", data);
      toast.success("Column created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectColumns"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Error creating column: ${error.response?.data.message || "Unknown error"}`,
      );
    },
  });
};

export const useUpdateColumn = () => {
  return useMutation({
    mutationKey: ["updateColumn"],
    mutationFn: async (payload: ColumnUpdatePayload) => updateColumns(payload),
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Error updating column: ${error.response?.data.message || "Unknown error"}`,
      );
    },
  });
};

export const useGetColumnTasks = (columnId: string) => {
  const query = useQuery({
    queryKey: ["columnTasks", columnId],
    queryFn: async () => {
      const res = await getColumnTasks(columnId);
      return res.data.data;
    },
    enabled: !!columnId,
  });

  if (query.isError) {
    const err = query.error as AxiosError<ErrorResponse>;
    toast.error(
      `Error fetching column tasks: ${err.response?.data.message || "Unknown error"}`,
    );
  }

  return query;
};

// export const useUpdateColumnTasks = () => {

//   return useMutation({
//     mutationKey: ["updateColumnTasks"],
//     mutationFn: async ({
//       tasks,
//       columnId,
//     }: {
//       tasks: Task[];
//       columnId: string;
//     }) => {
//       // TODO: call API here
//       // const res = await updateColumnTasks(columnId, tasks);
//       // return res.data;
//       console.log("Updating column tasks:", tasks, columnId);
//       return tasks;
//     },

//     onMutate: async ({ tasks, columnId }) => {
//       await queryClient.cancelQueries({ queryKey: ["columnTasks", columnId] });

//       // snapshot previous
//       const previousTasks = queryClient.getQueryData<Task[]>([
//         "columnTasks",
//         columnId,
//       ]);

//       queryClient.setQueryData<Task[]>(
//         ["columnTasks", columnId],
//         (oldTasks = []) => {
//           return oldTasks.map((task) => {
//             const updatedTask = tasks.find((t) => t.id === task.id);
//             return updatedTask ?? task;
//           });
//         },
//       );

//       return { previousTasks, columnId };
//     },

//     onError: (_error, _vars, context) => {
//       if (context?.previousTasks) {
//         queryClient.setQueryData<Task[]>(
//           ["columnTasks", context.columnId],
//           context.previousTasks,
//         );
//       }
//       toast.error("Failed to update column tasks");
//     },

//     onSettled: (_data, _error, { columnId }) => {
//       queryClient.invalidateQueries({ queryKey: ["columnTasks", columnId] });
//     },
//   });
// };

export const useUpdateTaskColumnId = () => {
  return useMutation({
    mutationKey: ["updateTaskColumnId"],
    mutationFn: async ({
      task,
      columnId,
    }: {
      task: Task;
      columnId: string;
    }) => {
      const res = await updateTaskColumnId(task.id, columnId);
      return res.data.data;
    },

    onMutate: async ({ task, columnId }) => {
      await queryClient.cancelQueries({ queryKey: ["columnTasks", columnId] });

      const sourceColumnId = task.columnId;

      const prevSourceTasks = queryClient.getQueryData<Task[]>([
        "columnTasks",
        sourceColumnId,
      ]);
      const prevDestTasks = queryClient.getQueryData<Task[]>([
        "columnTasks",
        columnId,
      ]);

      if (prevSourceTasks) {
        queryClient.setQueryData<Task[]>(
          ["columnTasks", sourceColumnId],
          prevSourceTasks.filter((t) => t.id !== task.id),
        );
      }

      if (prevDestTasks) {
        queryClient.setQueryData<Task[]>(
          ["columnTasks", columnId],
          [...prevDestTasks, { ...task, columnId }],
        );
      } else {
        queryClient.setQueryData<Task[]>(
          ["columnTasks", columnId],
          [{ ...task, columnId }],
        );
      }

      return {
        prevSourceTasks,
        prevDestTasks,
        sourceColumnId,
        destColumnId: columnId,
      };
    },

    onError: (error: AxiosError<ErrorResponse>, _variables, context) => {
      if (context) {
        queryClient.setQueryData<Task[]>(
          ["columnTasks", context.sourceColumnId],
          context.prevSourceTasks,
        );
        queryClient.setQueryData<Task[]>(
          ["columnTasks", context.destColumnId],
          context.prevDestTasks,
        );
      }
      toast.error(
        `Error updating task column: ${error.response?.data.message || "Unknown error"}`,
      );
    },

    onSettled: (_data, _error, { task, columnId }) => {
      queryClient.invalidateQueries({
        queryKey: ["columnTasks", task.columnId],
      });
      queryClient.invalidateQueries({ queryKey: ["columnTasks", columnId] });
    },
  });
};

export const useGetColumnTaskAmount = (id: string) => {
  return useQuery({
    queryKey: ["columnTaskAmount", id],
    queryFn: async () => getColumnTaskAmount(id),
    enabled: !!id,
    select: (data) => data.data.data,
  });
};

export const useDeleteColumn = () => {
  return useMutation({
    mutationKey: ["deleteColumn"],
    mutationFn: async (columnId: string) => deleteColumn(columnId),
    onSuccess: () => {
      toast.success("Column deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectColumns"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Error deleting column: ${error.response?.data.message || "Unknown error"}`,
      );
    },
  });
};

export const useUpdateColumnOrder = () => {
  return useMutation({
    mutationKey: ["updateColumnOrder"],
    mutationFn: async ({
      columnId,
      order,
    }: {
      columnId: string;
      order: number;
    }) => {
      console.log("Updating column order:", { columnId, order });
      const res = await updateColumnOrder(columnId, order);
      return res.data.data;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Error updating column order: ${error.response?.data.message || "Unknown error"}`,
      );
    },
  });
};
