import { useIsOverflow } from "@/hooks/useIsOverflow";
import { useCreateQuickTask } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import type { Column } from "@/types/column";
import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useParams } from "@tanstack/react-router";
import { GripVerticalIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useGetColumnTaskAmount } from "@/hooks/useColumn";
import ColumnTaskList from "./ColumnTaskList";

type SortableColumnProps = {
  column: Column;
};

const SortableColumn = ({ column }: SortableColumnProps) => {
  const { ref, isOverflow } = useIsOverflow("vertical");
  const projectId =
    useParams({ from: "/dashboard/_layout/projects/$projectId" }).projectId ||
    "";
  const [disabled, setDisabled] = useState(true);

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

  return (
    <>
      {/* COLUMN SORTABLE */}
      <div
        ref={setNodeRef}
        id={column.id}
        {...attributes}
        {...listeners}
        style={style}
        className={cn(
          "mr-2 flex h-fit max-h-full w-[300px] min-w-[300px] flex-col gap-1 rounded-lg bg-card px-4 pt-2 pb-4 shadow",
          isDragging && "dragging",
        )}
      >
        <ColumnHeader
          column={column}
          handleMouseDown={handleMouseDown}
          handleCreateQuickTask={handleCreateQuickTask}
        />
        {/* COLUMN TASK LIST */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={cn(
            "flex flex-col gap-1 overflow-x-hidden overflow-y-auto",
            isOverflow && "pr-1",
          )}
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <ColumnTaskList columnId={column.id} />
        </div>
      </div>
    </>
  );
};

export default SortableColumn;

type ColumnHeaderProps = {
  column: Column;
  handleMouseDown: () => void;
  handleCreateQuickTask: () => void;
};

const ColumnHeader = ({
  column,
  handleMouseDown,
  handleCreateQuickTask,
}: ColumnHeaderProps) => {
  const { data: taskAmount } = useGetColumnTaskAmount(column.id);
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <div className="flex items-center gap-1">
        <button className="bg-transparent p-1" onMouseDown={handleMouseDown}>
          <GripVerticalIcon className="size-4 text-muted-foreground hover:cursor-grab hover:text-foreground" />
        </button>
        <h2 className="font-display font-semibold">{column.name}</h2>
        <p className="flex items-center rounded-md p-1 font-display text-xs font-bold text-foreground">
          {taskAmount || 0}
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
  );
};
