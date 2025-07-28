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
import { useEffect, useRef, useState } from "react";

import Loading from "@/components/Loading";
import PriorityIcon from "@/components/PriorityIcon";
import {
  useGetTaskDetail,
  useRemoveAllTaskAssignees,
  useUnlinkAllTagsFromTask,
  useUpdateSingleTask,
} from "@/hooks/useTask";
import { priorityMapping, statusMapping } from "@/lib/utils";
import type { Task } from "@/types/task";

import useDebounce from "@/hooks/useDebounce";
import type { User } from "@/types/user";
import ChecklistSection from "../../ChecklistSection";
import TaskField from "../../TaskField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Textarea } from "../../ui/textarea";
import AssigneePopoverContent from "./AssigneePopoverContent";
import DatePopoverContent from "./DatePopoverContent";
import PriorityPopoverContent from "./PriorityPopoverContent";
import StatusPopoverContent from "./StatusPopoverContent";
import TaskDetailHeader from "./TaskDetailHeader";
import TimeEstPopoverContent from "./TimeEstPopoverContent";
import TagContentPopoverContent from "./TagContentPopoverContent";
import TagsInput from "@/components/TagsInput";
import AssigneesInput from "@/components/AssigneesInput";

type TaskDetailDialogProps = {
  taskId: string;
  children: React.ReactNode;
};

const TaskDetailDialog = ({ taskId, children }: TaskDetailDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState<Task>({} as Task);

  const { data, isLoading, isSuccess, error } = useGetTaskDetail(
    taskId,
    Boolean(taskId),
  );
  const [assignees, setAssignees] = useState<User[]>([]);
  const { mutate: removeAllTaskAssignee } = useRemoveAllTaskAssignees();
  const { mutate: updateTask } = useUpdateSingleTask();
  const { mutate: unlinkAllTags } = useUnlinkAllTagsFromTask();

  const debouncedTask = useDebounce<Task>(task, 500);

  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [task.title]);

  useEffect(() => {
    if (
      debouncedTask.id &&
      JSON.stringify(debouncedTask) !== JSON.stringify(data)
    ) {
      updateTask(debouncedTask);
    }
  }, [debouncedTask, updateTask, data]);

  useEffect(() => {
    if (isSuccess && data) {
      setTask(data);
      setAssignees(data.assignees || []);
    }
  }, [isSuccess, data]);

  const handleRemoveAllAssignees = () => {
    removeAllTaskAssignee(taskId);
    setAssignees([]);
  };

  const handleRemoveAllTags = () => {
    setTask((prev) => ({ ...prev, tags: [] }));
    unlinkAllTags(taskId);
  };

  const renderFieldRows = () => (
    <>
      {/* Status */}
      <TaskField
        fieldIcon={<CircleDotIcon className="size-4 text-muted-foreground" />}
        fieldName="Status"
        onRemove={() => setTask((prev) => ({ ...prev, status: null }))}
        valueNode={task.status && <span>{statusMapping(task.status)}</span>}
        popoverContent={(onClose) => (
          <StatusPopoverContent
            value={task.status}
            onChange={(val) => setTask((prev) => ({ ...prev, status: val }))}
            onClose={onClose}
          />
        )}
      />

      {/* Priority */}
      <TaskField
        fieldIcon={<FlagIcon className="size-4 text-muted-foreground" />}
        fieldName="Priority"
        onRemove={() => setTask((prev) => ({ ...prev, priority: null }))}
        valueNode={
          task.priority && (
            <div className="flex items-center gap-1">
              <PriorityIcon priority={task.priority} />
              <span>{priorityMapping(task.priority)}</span>
            </div>
          )
        }
        popoverContent={(onClose) => (
          <PriorityPopoverContent
            value={task.priority}
            onChange={(val) => setTask((prev) => ({ ...prev, priority: val }))}
            onClose={onClose}
          />
        )}
      />

      {/* Time Range */}
      <TaskField
        fieldIcon={<CalendarIcon className="size-4 text-muted-foreground" />}
        fieldName="Dates"
        onRemove={() => {
          setTask((prev) => ({
            ...prev,
            startDate: null,
            dueDate: null,
          }));
        }}
        valueNode={
          task.startDate || task.dueDate ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <CalendarArrowUpIcon className="size-3" />
                {task.startDate
                  ? format(new Date(task.startDate), "MMM dd")
                  : "Start"}
              </span>
              <ArrowRightIcon className="size-3" />
              <span className="flex items-center gap-1">
                <CalendarArrowDownIcon className="size-3" />
                {task.dueDate
                  ? format(new Date(task.dueDate), "MMM dd")
                  : "Due"}
              </span>
            </div>
          ) : null
        }
        fallbackNode={
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <CalendarArrowUpIcon className="size-3" />
              {task.startDate
                ? format(new Date(task.startDate), "MMM dd")
                : "Start"}
            </span>
            <ArrowRightIcon className="size-3" />
            <span className="flex items-center gap-1">
              <CalendarArrowDownIcon className="size-3" />
              {task.dueDate ? format(new Date(task.dueDate), "MMM dd") : "Due"}
            </span>
          </div>
        }
        popoverContent={(onClose) => (
          <DatePopoverContent
            startDate={task.startDate ? new Date(task.startDate) : null}
            dueDate={task.dueDate ? new Date(task.dueDate) : null}
            onChangeStartDate={(date) =>
              setTask((prev) => ({ ...prev, startDate: date?.toISOString() }))
            }
            onChangeDueDate={(date) =>
              setTask((prev) => ({ ...prev, dueDate: date?.toISOString() }))
            }
            onClose={onClose}
          />
        )}
      />

      {/* Assignees */}
      <TaskField
        fieldIcon={<UserIcon className="size-4 text-muted-foreground" />}
        fieldName="Assignees"
        onRemove={handleRemoveAllAssignees}
        valueNode={
          assignees.length > 0 ? <AssigneesInput assignees={assignees} /> : null
        }
        popoverContent={() => (
          <AssigneePopoverContent
            taskId={task.id}
            value={assignees}
            onChange={setAssignees}
          />
        )}
      />

      {/* Time Estimate */}
      <TaskField
        fieldIcon={<ClockIcon className="size-4 text-muted-foreground" />}
        fieldName="Time Estimated"
        onRemove={() => setTask((prev) => ({ ...prev, timeEstimate: null }))}
        valueNode={task.timeEstimate ? <span>{task.timeEstimate}h</span> : null}
        popoverContent={(onClose) => (
          <TimeEstPopoverContent
            value={task.timeEstimate}
            onChange={(val) =>
              setTask((prev) => ({ ...prev, timeEstimate: val }))
            }
            onClose={onClose}
          />
        )}
      />

      {/* Tags */}
      <TaskField
        fieldIcon={<TagIcon className="size-4 text-muted-foreground" />}
        fieldName="Tags"
        onRemove={handleRemoveAllTags}
        valueNode={
          task.tags && task.tags.length > 0 ? (
            <TagsInput tags={task.tags} />
          ) : null
        }
        popoverContent={() => (
          <TagContentPopoverContent
            taskId={task.id}
            value={task.tags}
            onChange={(tags) => setTask((prev) => ({ ...prev, tags }))}
            onClose={() => {}}
          />
        )}
      />
    </>
  );

  const renderContent = () => {
    if (isLoading) return <Loading />;
    if (error) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          Error loading task.
        </div>
      );
    }

    return (
      <>
        <TaskDetailHeader onClose={() => setIsOpen(false)} task={task} />
        <div className="grid-col-8 z-0 grid h-full max-h-full grid-flow-col overflow-hidden">
          {/* Main */}
          <div className="col-span-7 flex flex-col items-center overflow-y-auto border-r p-8 lg:p-12">
            <div className="flex w-full flex-col gap-4 lg:max-w-3xl xl:max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  <textarea
                    ref={ref}
                    className="max-h-full w-full resize-none overflow-hidden rounded-lg bg-transparent p-2 text-2xl font-semibold"
                    rows={1}
                    value={task.title}
                    onChange={(e) =>
                      setTask((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    onBlur={() => {
                      if (!task.title.trim()) {
                        setTask((prev) => ({
                          ...prev,
                          title: "Untitled Task",
                        }));
                      }
                    }}
                    placeholder="Task Title"
                    required
                  />
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-x-3">
                {renderFieldRows()}
              </div>

              <div className="flex flex-col gap-2 py-2">
                <h4 className="font-display text-lg font-semibold">
                  Description
                </h4>
                <Textarea
                  className="min-h-48 py-3 md:text-xs"
                  placeholder="Type in task description..."
                  value={task.description || ""}
                  onChange={(e) =>
                    setTask((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <ChecklistSection taskId={taskId} />
            </div>
          </div>

          {/* Sidebar */}
          {/* <div className="col-span-1 flex items-start justify-center px-4 py-8 lg:py-12">
            Sidebar
          </div> */}
        </div>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="flex h-[80%] max-h-[80%] w-full min-w-2xl flex-col gap-0 overflow-hidden rounded-xl border p-0 lg:max-w-[80%]"
        showCloseButton={false}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
