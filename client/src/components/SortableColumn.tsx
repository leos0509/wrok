import type { Column } from "@/types/column";
import type { Task } from "@/types/task";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EllipsisVerticalIcon } from "lucide-react";
import React, { useMemo } from "react";
import SortableTask from "./SortableTask";
import { Button } from "./ui/button";

type SortableColumnProps = {
  column: Column;
  tasks?: Task[];
};

const SortableColumn = ({ column, tasks }: SortableColumnProps) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });
  const taskIdList = useMemo(() => tasks?.map((t) => t.id) || [], [tasks]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: column.color,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="h-full w-[250px] shrink-0 rounded-lg p-2 opacity-40 shadow-sm ring ring-red-400 ring-inset"
        style={style}
        {...attributes}
        {...listeners}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      className="flex h-full w-[250px] shrink-0 flex-col items-start justify-start gap-2 overflow-hidden rounded-lg p-2 shadow-sm"
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex w-full items-center justify-between gap-1 p-1">
        <div className="w-full overflow-hidden">
          <h2 className="line-clamp-1 w-full font-semibold">{column.name}</h2>
        </div>
        <Button variant="ghost" size="iconSm" className="rounded-lg p-1">
          <EllipsisVerticalIcon className="size-3" />
        </Button>
      </div>
      <div className="scrollbar-thin flex max-h-full w-full flex-grow flex-col gap-2 overflow-y-auto scrollbar-thumb-gray-400 scrollbar-track-transparent">
        <SortableContext items={taskIdList}>
          {tasks?.map((task) => <SortableTask task={task} key={task.id} />)}
        </SortableContext>
      </div>
    </div>
  );
};

export default React.memo(SortableColumn);
