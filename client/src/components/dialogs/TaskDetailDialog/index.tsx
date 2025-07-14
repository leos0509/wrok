import { cn, priorityMapping, statusMapping } from "@/lib/utils";
import type { Task } from "@/types/task";
import { format } from "date-fns";
import {
  ArrowRightIcon,
  CalendarArrowDownIcon,
  CalendarArrowUpIcon,
  CalendarIcon,
  CircleDotIcon,
  ClockIcon,
  FlagIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import TaskField from "../../TaskField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Textarea } from "../../ui/textarea";
import ChecklistSection from "../../ChecklistSection";
import TaskDetailHeader from "./TaskDetailHeader";
import PriorityIcon from "@/components/PriorityIcon";

type TaskDetailDialogProps = {
  taskData: Task;
  children: React.ReactNode;
};

const TaskDetailDialog = ({ taskData, children }: TaskDetailDialogProps) => {
  const [task, setTask] = useState<Task>(taskData);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="flex h-[80%] max-h-[80%] w-full min-w-2xl flex-col gap-0 border p-0 lg:max-w-[80%]"
        showCloseButton={false}
      >
        {/* HEADER */}
        <TaskDetailHeader onClose={() => setIsOpen(false)} />
        <div className="grid-col-8 grid h-full max-h-full grid-flow-col overflow-hidden">
          {/* MAIN CONTENT */}
          <div className="scrollbar-thumb-rounded-full col-span-7 scrollbar-thin flex w-full shrink-0 flex-col items-center overflow-y-auto border-r p-8 scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 lg:p-12">
            <div className="flex w-full flex-col gap-4 lg:max-w-3xl xl:max-w-4xl">
              <DialogHeader>
                <DialogTitle className="px-1 text-2xl">
                  {task.title}
                </DialogTitle>
              </DialogHeader>
              <div className="grid w-full grid-cols-2 gap-x-4 gap-y-3">
                {/* Status */}
                <TaskField
                  fieldIcon={
                    <CircleDotIcon className="size-4 text-muted-foreground" />
                  }
                  fieldName="Status"
                  valueNode={
                    <span className="inline-block rounded">
                      {statusMapping(task.status)}
                    </span>
                  }
                />

                {/* Priority */}
                <TaskField
                  fieldIcon={
                    <FlagIcon className="size-4 text-muted-foreground" />
                  }
                  fieldName="Priority"
                  valueNode={
                    <div className="flex items-center gap-1">
                      <PriorityIcon priority={task.priority} />
                      <span className="inline-block rounded">
                        {priorityMapping(task.priority)}
                      </span>
                    </div>
                  }
                />

                {/* Time Range */}
                <TaskField
                  fieldIcon={
                    <CalendarIcon className="size-4 text-muted-foreground" />
                  }
                  fieldName="Dates"
                  valueNode={
                    <div className="lg:text-md flex w-full items-center justify-start gap-2 text-xs">
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          task.startDate
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        <CalendarArrowUpIcon className="size-3 lg:size-4" />
                        <p className="leading-[100%]">
                          {task.startDate
                            ? format(new Date(task.startDate), "MMM dd")
                            : "Start"}
                        </p>
                      </div>
                      <ArrowRightIcon
                        className={cn(
                          "size-3",
                          task.startDate && task.dueDate
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      />
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          task.dueDate
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        <CalendarArrowDownIcon className="size-3 lg:size-4" />
                        <p className="leading-[100%]">
                          {task.dueDate
                            ? format(new Date(task.dueDate), "MMM dd")
                            : "Due"}
                        </p>
                      </div>
                    </div>
                  }
                />

                {/* Assignees */}
                <TaskField
                  fieldIcon={
                    <UserIcon className="size-4 text-muted-foreground" />
                  }
                  fieldName="Assignees"
                  valueNode={
                    task.assignees?.map((assignee) => (
                      <span
                        key={assignee.id}
                        className="inline-block rounded bg-gray-200 px-2 py-1 text-sm"
                      >
                        {assignee.firstName} {assignee.lastName}
                      </span>
                    )) || null
                  }
                />

                {/* Time Estimated */}
                <TaskField
                  fieldIcon={
                    <ClockIcon className="size-4 text-muted-foreground" />
                  }
                  fieldName="Time Estimated"
                  valueNode={null}
                />

                {/* Tags */}
                <TaskField
                  fieldIcon={
                    <TagIcon className="size-4 text-muted-foreground" />
                  }
                  fieldName="Tags"
                  valueNode={null}
                />
              </div>
              <div className="flex w-full flex-col gap-2 py-2">
                <h4 className="px-1 font-display text-lg font-semibold">
                  Description
                </h4>
                <Textarea
                  className="h-fit min-h-48 w-full rounded-md border-border/80 p-4 text-sm shadow-none focus:outline-none"
                  placeholder="Task description"
                  value={task.description || ""}
                  onChange={(e) =>
                    setTask({ ...task, description: e.target.value })
                  }
                />
              </div>
              <ChecklistSection />
            </div>
          </div>
          {/* SIDEBAR CONTENT */}
          <div className="col-span-1 flex w-full shrink-0 items-start justify-center px-4 py-8 lg:py-12">
            Sidebar
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
