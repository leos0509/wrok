import { useDeleteColumn, useGetColumnTasks } from "@/hooks/useColumn";
import { useIsOverflow } from "@/hooks/useIsOverflow";
import { useUpdateTasks } from "@/hooks/useTask";
import type { Column } from "@/types/column";
import type { Task } from "@/types/task";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  EllipsisVerticalIcon,
  PenLineIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import CreateTaskDialog from "./dialogs/CreateTaskDialog";
import Loading from "./Loading";
import SortableTask from "./SortableTask";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type SortableColumnProps = {
  column: Column;
};

const SortableColumn = ({ column }: SortableColumnProps) => {
  const {
    data,
    isLoading: isTasksLoading,
    isSuccess: isTasksSuccess,
    error: tasksError,
  } = useGetColumnTasks(column.id);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeTaskId),
    [activeTaskId, tasks],
  );
  const { mutate: updateTasks } = useUpdateTasks();
  const { ref, isOverflow } = useIsOverflow();

  useEffect(() => {
    if (data && isTasksSuccess) {
      setTasks(data);
    }
  }, [data, isTasksSuccess]);

  const taskIdList = useMemo(
    () => tasks?.map((task: Task) => task.id) || [],
    [tasks],
  );

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(pointerSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active) return;
    setActiveTaskId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTaskId(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeIndex = taskIdList.indexOf(active.id as string);
    const overIndex = taskIdList.indexOf(over.id as string);

    if (activeIndex === -1 || overIndex === -1) return;

    if (activeIndex === overIndex) return;

    const updatedTasks = arrayMove(tasks, activeIndex, overIndex);

    setTasks(updatedTasks);

    updateTasks(updatedTasks);
  };

  const renderedTasks = useMemo(() => {
    if (isTasksLoading) return <Loading />;
    if (tasksError)
      return <div className="py-2 text-red-400">Error loading tasks</div>;
    if (!tasks || tasks.length === 0) return null;

    return tasks.map((task) => <SortableTask task={task} key={task.id} />);
  }, [isTasksLoading, tasksError, tasks]);

  return (
    <div className="flex h-full w-[250px] shrink-0 flex-col items-start justify-start gap-2 overflow-hidden rounded-lg bg-secondary p-2 text-secondary-foreground shadow-sm">
      <div className="flex w-full items-center justify-between gap-1 p-1">
        <div className="w-full overflow-hidden">
          <h2 className="line-clamp-1 w-full font-semibold">{column.name}</h2>
        </div>
        <ColumnMenu columnId={column.id}>
          <Button variant="ghost" size="iconSm" className="rounded-lg p-1">
            <EllipsisVerticalIcon className="size-3" />
          </Button>
        </ColumnMenu>
      </div>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="scrollbar-thin flex max-h-full w-full flex-grow flex-col gap-2 overflow-y-auto pb-1 scrollbar-thumb-gray-400 scrollbar-track-transparent"
        style={{ paddingRight: isOverflow ? "0.3rem" : "0" }}
      >
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={taskIdList}
            strategy={verticalListSortingStrategy}
          >
            {renderedTasks}
          </SortableContext>
          <DragOverlay className="rotate-2">
            {activeTask ? <SortableTask task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
      <CreateTaskDialog columnId={column.id}>
        <Button className="w-full">
          <PlusIcon className="size-4" />
          <span>Add Task</span>
        </Button>
      </CreateTaskDialog>
    </div>
  );
};

export default React.memo(SortableColumn);

type ColumnMenuProps = {
  columnId: string;
  children: React.ReactNode;
};

const ColumnMenu = ({ children, columnId }: ColumnMenuProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteColumn } = useDeleteColumn();

  const handleDeleteColumn = () => {
    deleteColumn(columnId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="end" className="w-36 p-2">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              setOpen(false);
            }}
          >
            <PenLineIcon className="size-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              handleDeleteColumn();
            }}
          >
            <Trash2Icon className="size-4" />
            <span>Delete</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
