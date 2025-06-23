import { cn, userShortName } from "@/lib/utils";
import type { Task } from "@/types/task";
import { format } from "date-fns";
import {
  CalendarArrowDownIcon,
  CalendarArrowUpIcon,
  ChevronDownIcon,
  PlusIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

type TaskCardProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const hasAssignees = task.assignees && task.assignees.length > 0;

  const renderAssignees = () => {
    if (!task.assignees || task.assignees.length === 0) {
      return null;
    }

    return (
      <>
        {task.assignees.map((assignee, index) => (
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
    );
  };

  return (
    <div className="flex w-full cursor-pointer flex-col gap-2 rounded-md bg-card px-4 py-2 shadow-sm transition-colors duration-100 ease-in-out hover:bg-accent">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
              <h3 className="text-md line-clamp-1 font-semibold text-foreground">
                {task.title}
              </h3>
              <p className="line-clamp-1 text-xs text-muted-foreground italic">
                {task.description || "No description provided."}
              </p>
            </div>
            <ChevronDownIcon className="size-4 group-data-[state=open]/collapsible:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-1 flex flex-col gap-2">
          <div className="flex items-center">
            {renderAssignees()}

            <div
              className={cn(
                "flex size-6 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-gray-300 text-[10px] text-foreground hover:bg-gray-400",
                hasAssignees && "-ml-1.5",
              )}
            >
              <PlusIcon className="size-3" />
            </div>
          </div>

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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TaskCard;
