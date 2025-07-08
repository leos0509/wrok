import type { Task } from "@/types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

type SortableTaskProps = {
  task: Task;
};

const SortableTask = ({ task }: SortableTaskProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex w-full flex-col items-start justify-start gap-1 rounded-md bg-white p-2 shadow-sm transition-colors duration-200 ease-in-out hover:bg-gray-50"
      {...attributes}
      {...listeners}
    >
      <div className="flex w-full items-center justify-between gap-1">
        <div className="w-full overflow-hidden">
          <h3 className="line-clamp-1 text-sm font-semibold">{task.title}</h3>
          <p className="line-clamp-2 text-xs text-gray-400">
            {task.description} Lorem ipsum
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SortableTask);
