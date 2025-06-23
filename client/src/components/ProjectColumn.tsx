import { useGetColumnTasks, useUpdateColumn } from "@/hooks/useColumn";
import { useGetProjectColumns } from "@/hooks/useProject";
import { useCreateQuickTask } from "@/hooks/useTask";
import type { Column } from "@/types/column";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useParams } from "@tanstack/react-router";
import { GripVerticalIcon, PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import TaskCard from "./TaskCard";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const ProjectColumns = () => {
  const params = useParams({ from: "/dashboard/_layout/projects/$projectId" });
  const { data, isLoading, isError, isSuccess } = useGetProjectColumns(
    params.projectId || "",
    Boolean(params.projectId),
  );

  const [columns, setColumns] = useState<Column[]>([]);
  const { mutate } = useUpdateColumn();

  useEffect(() => {
    if (isSuccess && data) setColumns(data);
  }, [isSuccess, data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = columns.findIndex((c) => c.id === active.id);
    const newIndex = columns.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newCols = arrayMove(columns, oldIndex, newIndex).map((col, i) => ({
      ...col,
      position: i + 1,
    }));
    setColumns(newCols);

    const columnMap = newCols.map((col) => ({
      id: col.id,
      position: col.position,
    }));

    mutate(columnMap);
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="py-2 text-red-400">Error loading project columns</div>
    );
  if (!columns.length)
    return (
      <div className="py-2 text-muted-foreground">No columns available</div>
    );

  return (
    <div className="flex h-full min-w-0 overflow-x-auto py-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={columns.map((col) => col.id)}>
          {columns.map((column) => (
            <SortableColumn key={column.id} column={column} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ProjectColumns;

type SortableColumnProps = {
  column: Column;
};

const SortableColumn = ({ column }: SortableColumnProps) => {
  const [disabled, setDisabled] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const taskListRef = useRef<HTMLDivElement>(null);
  const projectId =
    useParams({ from: "/dashboard/_layout/projects/$projectId" }).projectId ||
    "";
  const { data: tasks, isLoading: tasksLoading } = useGetColumnTasks(column.id);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.id,
      transition: { duration: 200, easing: "ease-in-out" },
      disabled,
    });
  const { mutate } = useCreateQuickTask();

  useEffect(() => {
    const el = taskListRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    };

    checkOverflow(); // check on mount

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [tasks]);

  const style = {
    transform: CSS.Transform.toString(transform),
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

  const renderTasks = () => {
    if (tasksLoading) return <Loading />;
    if (!tasks || !tasks.length)
      return (
        <div className="py-2 text-muted-foreground">No tasks available</div>
      );
    return tasks.map((task) => <TaskCard key={task.id} task={task} />);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="mr-2 flex h-fit max-h-[600px] min-h-[400px] min-w-[300px] flex-col gap-1 rounded-lg bg-card px-4 pt-2 pb-4 shadow"
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
        ref={taskListRef}
        className={cn(
          "flex h-full flex-col gap-1 overflow-y-auto",
          isOverflowing && "pr-1",
        )}
      >
        {renderTasks()}
      </div>
    </div>
  );
};
