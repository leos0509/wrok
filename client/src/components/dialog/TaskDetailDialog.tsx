import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import type { Task } from "@/types/task";
import { CalendarArrowDownIcon, CalendarArrowUpIcon } from "lucide-react";

type TaskDetailDialogProps = {
  task: Task;
  trigger: React.ReactNode;
};

const TaskDetailDialog = ({ task, trigger }: TaskDetailDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[80%] min-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>
            {task.description || "No description provided."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-md font-semibold">Assignees</h3>
            <div className="flex flex-wrap gap-2">
              {task.assignees?.length ? (
                task.assignees.map((assignee) => (
                  <span
                    key={assignee.id}
                    className="inline-block rounded bg-gray-200 px-2 py-1 text-sm"
                  >
                    {assignee.firstName} {assignee.lastName}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground">No assignees</span>
              )}
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-1">
            <div className="flex gap-1">
              <CalendarArrowUpIcon className="size-4 text-muted-foreground" />
              <h3 className="text-md font-semibold">Start Date</h3>
              <p className="text-sm text-muted-foreground">
                {task.startDate
                  ? new Date(task.startDate).toLocaleDateString()
                  : "No start date"}
              </p>
            </div>
            <div className="flex gap-1">
              <CalendarArrowDownIcon className="size-4 text-muted-foreground" />
              <h3 className="text-md font-semibold">Due Date</h3>
              <p className="text-sm text-muted-foreground">
                {task.endDate
                  ? new Date(task.endDate).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
