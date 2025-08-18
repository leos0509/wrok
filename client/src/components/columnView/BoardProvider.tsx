import type { Column as TColumn } from "@/types/column";
import type { Task } from "@/types/task";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import React, { useState } from "react";
import ColumnOverlay from "./overlays/ColumnOverlay";
import TaskCardOverlay from "./overlays/TaskCardOverlay";
import { queryClient } from "@/lib/queryClient";
import { useUpdateTaskColumnId } from "@/hooks/useColumn";

type BoardProviderProps = {
  children: React.ReactNode;
};

const BoardProvider = ({ children }: BoardProviderProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<TColumn | null>(null);

  const { mutate: updateTaskColumnId } = useUpdateTaskColumnId();
  // const { mutate: updateColumnTasks } = useUpdateColumnTasks();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active.data.current) return;

    if (active.data.current.type === "task") {
      setActiveTask(active.data.current.task as Task);
    } else if (active.data.current.type === "column") {
      setActiveColumn(active.data.current.column as TColumn);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !active || !over.data.current || !active.data.current) return;
    if (active.id === over.id) return;

    if (active.data.current.type === "task") {
      if (over.data.current.type === "column") {
        const activeTask = active.data.current.task as Task;
        const overColumn = over.data.current.column as TColumn;
        if (activeTask.columnId !== overColumn.id) {
          updateTaskColumnId({ task: activeTask, columnId: overColumn.id });
        }
      }
      if (over.data.current.type === "task") {
        const activeTask = active.data.current.task as Task;
        const overTask = over.data.current.task as Task;
        if (activeTask.columnId !== overTask.columnId) {
          updateTaskColumnId({ task: activeTask, columnId: overTask.columnId });
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active || !over.data.current || !active.data.current) return;
    if (active.id === over.id) {
      setActiveTask(null);
      setActiveColumn(null);
      return;
    }

    if (
      active.data.current.type === "task" &&
      over.data.current.type === "task"
    ) {
      const activeTask = active.data.current.task as Task;
      const overTask = over.data.current.task as Task;
      if (activeTask.columnId === overTask.columnId) {
        const previousTasks = queryClient.getQueryData<Task[]>([
          "columnTasks",
          activeTask.columnId,
        ]);
        if (previousTasks) {
          const updatedTasks = previousTasks.map((task) => {
            if (task.id === activeTask.id)
              return { ...task, order: overTask.order };
            if (task.id === overTask.id)
              return { ...task, order: activeTask.order };
            return task;
          });
          // updateColumnTasks({
          //   columnId: activeTask.columnId,
          //   tasks: updatedTasks,
          // });
        }
      }
    }

    setActiveTask(null);
    setActiveColumn(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      {children}
      {activeTask && (
        <DragOverlay>
          <TaskCardOverlay task={activeTask} />
        </DragOverlay>
      )}
      {activeColumn && (
        <DragOverlay>
          <ColumnOverlay column={activeColumn} />
        </DragOverlay>
      )}
    </DndContext>
  );
};

export default BoardProvider;
