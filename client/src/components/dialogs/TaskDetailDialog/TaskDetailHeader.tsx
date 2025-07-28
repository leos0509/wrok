import { Button } from "@/components/ui/button";
import { useDeleteTask } from "@/hooks/useTask";
import type { Task } from "@/types/task";
import { PinIcon, Trash2Icon, XIcon } from "lucide-react";

type TaskDetailHeaderProps = {
  task: Task;
  onClose: () => void;
};

const TaskDetailHeader = ({ task, onClose }: TaskDetailHeaderProps) => {
  const { mutate: deleteTask } = useDeleteTask();
  const handleDeleteTask = () => {
    deleteTask(task.id, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Error deleting task:", error);
      },
    });
  };
  return (
    <div className="z-50 flex h-fit w-full items-center justify-center gap-2 border-r border-b bg-secondary px-4 py-3">
      <div className="w-full text-sm font-semibold text-muted-foreground">
        <span className="rounded-md p-1 px-2 hover:cursor-pointer hover:bg-accent hover:text-accent-foreground">
          {task.project?.name || "N/A"}
        </span>{" "}
        /{" "}
        <span className="rounded-md p-1 px-2 hover:cursor-pointer hover:bg-accent hover:text-accent-foreground">
          {task.column?.name || "N/A"}
        </span>
      </div>
      {/* BUTTONS */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="iconSm"
          className="rounded-lg hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleDeleteTask}
        >
          <Trash2Icon className="size-4" />
        </Button>
        <Button variant="ghost" size="iconSm" className="rounded-lg">
          <PinIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="iconSm"
          className="rounded-lg"
          onClick={() => onClose()}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskDetailHeader;
