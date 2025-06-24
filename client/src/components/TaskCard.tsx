import { cn, userShortName } from "@/lib/utils";
import type { Task } from "@/types/task";
import type { User } from "@/types/user";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import {
  CalendarArrowDownIcon,
  CalendarArrowUpIcon,
  GripVerticalIcon,
  PlusIcon,
  SquarePenIcon,
} from "lucide-react";
import TaskDetailDialog from "./dialog/TaskDetailDialog";
import { useState } from "react";

type TaskCardProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const [disabled, setDisabled] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      transition: { duration: 200, easing: "ease-in-out" },
      data: task,
      disabled,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      className="flex w-full cursor-pointer flex-col gap-2 rounded-md bg-card p-2 shadow-sm transition-colors duration-100 ease-in-out hover:bg-accent"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      id={task.id}
    >
      <div className="flex items-center justify-between pr-1">
        <div className="flex items-center gap-1">
          <button
            className="px-1 hover:cursor-grab"
            onMouseDown={() => setDisabled(false)}
            onMouseUp={() => setDisabled(true)}
          >
            <GripVerticalIcon className="size-4 text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground" />
          </button>
          <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
            <h3 className="text-md line-clamp-1 font-semibold text-foreground">
              {task.title}
            </h3>
            <p className="line-clamp-1 text-xs text-muted-foreground italic">
              {task.description || "No description provided."}
            </p>
          </div>
        </div>
        <TaskDetailDialog
          task={task}
          trigger={
            <SquarePenIcon className="size-4 text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground" />
          }
        />
      </div>
      <TaskCardAssignees />
      <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-1">
          {task.startDate ? (
            <>
              <CalendarArrowUpIcon className="size-4" />
              <span className="inline-block align-middle leading-none">
                {" "}
                {format(new Date(task.startDate), "MMM d")}
              </span>
            </>
          ) : (
            <>
              <CalendarArrowUpIcon className="size-4" />
              <span className="text-muted-foreground">No start date</span>
            </>
          )}
        </div>
        <div className="flex items-center justify-center gap-1">
          {task.endDate ? (
            <>
              <CalendarArrowDownIcon className="size-4" />{" "}
              <span className="inline-block align-middle leading-none">
                {format(new Date(task.endDate), "MMM d")}
              </span>
            </>
          ) : (
            <>
              <CalendarArrowDownIcon className="size-4" />{" "}
              <span className="text-muted-foreground">No due date</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

type TaskCardAssigneesProps = {
  assignees?: User[];
};

const TaskCardAssignees = ({ assignees }: TaskCardAssigneesProps) => {
  const hasAssignees = assignees && assignees.length > 0;

  return (
    <div className="flex items-center">
      {hasAssignees && (
        <>
          {assignees.map((assignee, index) => (
            <div
              className={cn(
                "flex size-6 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-foreground text-[10px] text-background",
                index > 0 && "-ml-1.5",
              )}
              key={assignee.id}
            >
              {assignee.imgUrl ? (
                <img
                  key={assignee.id}
                  src={assignee.imgUrl}
                  alt={`${assignee.firstName} ${assignee.lastName}`}
                  className="w-full rounded-full object-cover"
                />
              ) : (
                <div
                  key={assignee.id}
                  className="flex items-center justify-center uppercase"
                >
                  {userShortName(assignee.firstName, assignee.lastName)}
                </div>
              )}
            </div>
          ))}
        </>
      )}
      <div
        className={cn(
          "flex size-6 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-gray-300 text-[10px] text-foreground hover:bg-gray-400",
          hasAssignees && "-ml-1.5",
        )}
      >
        <PlusIcon className="size-3" />
      </div>
    </div>
  );
};
