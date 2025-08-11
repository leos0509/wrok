import type { Task } from "@/types/task";
import { format } from "date-fns";
import {
  CalendarArrowDownIcon,
  CalendarArrowUpIcon,
  PenLineIcon,
} from "lucide-react";
import React from "react";
import TaskDetailDialog from "../../dialogs/TaskDetailDialog";
import { Button } from "../../ui/button";

type TaskCardOverlayProps = {
  task: Task;
};

const TaskCardOverlay = ({ task }: TaskCardOverlayProps) => {
  return (
    <div
      className={`hover:border-inset relative flex w-full cursor-pointer flex-col items-start justify-start gap-2 rounded-md border border-gray-200 bg-white p-2 shadow-xs transition-all duration-200 ease-in-out hover:border hover:border-primary hover:bg-accent`}
    >
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

export default React.memo(TaskCardOverlay);
