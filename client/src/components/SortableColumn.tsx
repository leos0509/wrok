import { useGetColumnTasks } from "@/hooks/useColumn";
import { useIsOverflow } from "@/hooks/useIsOverflow";
import { useCreateQuickTask, useUpdateTaskPosition } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import type { Column } from "@/types/column";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useParams } from "@tanstack/react-router";
import { GripVerticalIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import TaskCard from "./TaskCard";
import { Button } from "./ui/button";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { Task } from "@/types/task";

type SortableColumnProps = {
  column: Column;
};

const SortableColumn = ({ column }: SortableColumnProps) => {
  const [disabled, setDisabled] = useState(true);
  const { ref, isOverflow } = useIsOverflow("vertical");
  const projectId =
    useParams({ from: "/dashboard/_layout/projects/$projectId" }).projectId ||
    "";
  const {
    data,
    isLoading: tasksLoading,
    isSuccess,
  } = useGetColumnTasks(column.id);
  const [tasks, setTasks] = useState<Task[] | null>();
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: column.id,
    transition: { duration: 200, easing: "ease-in-out" },
    disabled,
  });
  const { mutate } = useCreateQuickTask();
  const { mutate: mutateUpdateTaskPostition } = useUpdateTaskPosition();

  useEffect(() => {
    if (isSuccess && data) {
      setTasks(data);
    }
  }, [isSuccess, data]);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    background: column.color,
  };

  const handleMouseDown = () => {
    setDisabled(false);
  };

  const handleCreateQuickTask = () => {
    mutate({
      projectId,
      columnId: column.id,
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id || !tasks) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...tasks];
    const [movedTask] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, movedTask);

    // Assign index-based position
    const updatedTasks = reordered.map((task, index) => ({
      ...task,
      position: index,
    }));

    setTasks(updatedTasks);

    const payload = updatedTasks.map((task) => ({
      id: task.id,
      position: task.position,
    }));
    mutateUpdateTaskPostition(payload);
  };

  const renderTasks = () => {
    if (tasksLoading) return <Loading />;

    if (!tasks || !tasks.length)
      return (
        <div className="py-2 text-muted-foreground">No tasks available</div>
      );

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement, restrictToVerticalAxis]}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "mr-2 flex max-h-full w-[300px] min-w-[300px] flex-col gap-1 rounded-lg bg-card px-4 pt-2 pb-4 shadow",
        isDragging && "dragging",
      )}
      style={{
        ...style,
        height: "fit-content",
      }}
      id={column.id}
    >
      <div className="flex items-center justify-between gap-2 py-1">
        <div className="flex items-center gap-1">
          <button className="bg-transparent p-1" onMouseDown={handleMouseDown}>
            <GripVerticalIcon className="size-4 text-muted-foreground hover:cursor-grab hover:text-foreground" />
          </button>
          <h2 className="font-display font-semibold">{column.name}</h2>
          <p className="flex items-center rounded-md p-1 font-display text-xs font-bold text-foreground">
            {tasks?.length || 0}
          </p>
        </div>
        <Button
          variant="ghost"
          size="iconSm"
          className="rounded-full"
          onClick={handleCreateQuickTask}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={cn(
          "flex flex-col gap-1 overflow-y-auto overflow-x-hidden",
          isOverflow && "pr-1",
        )}
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {renderTasks()}
      </div>
    </div>
  );
};

export default SortableColumn;
