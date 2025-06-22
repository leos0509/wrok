import type { Task } from "@/types/task";
import { CalendarArrowDownIcon, CalendarArrowUpIcon } from "lucide-react";
import { format } from "date-fns";
import { cn, userShortName } from "@/lib/utils";

type TaskCardProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const isHaveDate = task.startDate || task.endDate;

  const renderAssignees = () => {
    if (!task.assignees || task.assignees.length === 0) {
      return null;
    }

    return (
      <div className="flex items-center">
        {task.assignees.map((assignee, index) => (
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-full border-2 border-background bg-foreground text-[10px] text-background overflow-hidden",
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
      </div>
    );
  };

  return (
    <div className="flex w-full cursor-pointer flex-col gap-2 rounded-md bg-card p-2 shadow-sm transition-colors duration-100 ease-in-out hover:bg-accent">
      <div>
        <h3 className="text-md font-semibold text-foreground">{task.title}</h3>
        <p className="text-xs text-muted-foreground italic">
          {task.description || "No description provided."}
        </p>
      </div>
      {renderAssignees()}

      {isHaveDate && (
        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            {task.startDate && (
              <>
                <CalendarArrowUpIcon className="size-4" />
                <span className="inline-block align-middle leading-none">
                  {" "}
                  {format(new Date(task.startDate), "MMM d")}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center justify-center gap-1">
            {task.endDate && (
              <>
                <CalendarArrowDownIcon className="size-4" />{" "}
                <span className="inline-block align-middle leading-none">
                  {format(new Date(task.endDate), "MMM d")}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
