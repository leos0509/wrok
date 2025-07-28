import { useGetTaskById } from "@/hooks/useTask";
import type { Task } from "@/types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import {
  CalendarArrowDownIcon,
  CalendarArrowUpIcon,
  PenLineIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import TaskDetailDialog from "./dialogs/TaskDetailDialog";
import Loading from "./Loading";
import { Button } from "./ui/button";

type SortableTaskProps = {
  taskId: string;
};

const SortableTask = ({ taskId }: SortableTaskProps) => {
  const { data, isLoading, isSuccess } = useGetTaskById(
    taskId,
    Boolean(taskId),
  );
  const [task, setTask] = React.useState<Task | null>(null);

  useEffect(() => {
    if (isSuccess && data) {
      setTask(data);
    }
  }, [isSuccess, data]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task?.id || "",
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isLoading) return <Loading />;

  if (!task) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`hover:border-inset relative flex w-full cursor-pointer flex-col items-start justify-start gap-2 rounded-md border border-gray-200 bg-white shadow-xs transition-all duration-200 ease-in-out hover:border hover:border-primary hover:bg-accent ${isDragging ? "" : "p-2"}`}
      {...attributes}
      {...listeners}
    >
      {isDragging && (
        <div className="inset absolute z-50 flex h-full w-full items-center justify-center rounded-md bg-gray-100 shadow-lg" />
      )}
      <div className="flex w-full items-start justify-between gap-1">
        <div className="flex w-full items-start justify-between gap-1">
          <div className="flex w-full flex-col items-start justify-start overflow-hidden">
            <h3 className="line-clamp-1 text-sm font-semibold">{task.title}</h3>
            <p className="line-clamp-2 text-left text-xs text-muted-foreground">
              {task.description || "No description provided."}
            </p>
          </div>
          <TaskDetailDialog taskId={task.id}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <PenLineIcon className="size-4" />
            </Button>
          </TaskDetailDialog>
        </div>
      </div>
      {task.startDate || task.dueDate ? (
        <div className="flex w-full items-center justify-between gap-2">
          {task.startDate && (
            <div className="flex items-center gap-1">
              <CalendarArrowUpIcon className="size-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {format(new Date(task.startDate), "MMM dd")}
              </span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <CalendarArrowDownIcon className="size-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {format(new Date(task.dueDate), "MMM dd")}
              </span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(SortableTask);
