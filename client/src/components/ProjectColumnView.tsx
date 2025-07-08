import { useUpdateColumn } from "@/hooks/useColumn";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetProjectColumns, useGetProjectTasks } from "@/hooks/useProject";
import type { Column, ColumnUpdatePayload } from "@/types/column";
import type { Task } from "@/types/task";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Loading from "./Loading";
import SortableColumn from "./SortableColumn";
import SortableTask from "./SortableTask";

const ProjectColumnView = () => {
  const params = useParams({ from: "/dashboard/_layout/projects/$projectId" });
  const {
    data: columnData,
    isLoading: isColumnLoading,
    error: columnError,
  } = useGetProjectColumns(params.projectId || "", Boolean(params.projectId));
  const {
    data: taskData,
    isLoading: isTaskLoading,
    error: taskError,
  } = useGetProjectTasks(params.projectId || "", Boolean(params.projectId));

  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const columnIdList = useMemo(() => columns.map((c) => c.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const debounceColumns = useDebounce(columns, 1000);
  const { mutate: updateProjectColumns } = useUpdateColumn();

  useEffect(() => {
    if (columnData) {
      setColumns(columnData);
    }
  }, [columnData]);

  useEffect(() => {
    if (taskData) {
      setTasks(taskData);
    }
  }, [taskData]);

  useEffect(() => {
    if (debounceColumns.length > 0) {
      const payload: ColumnUpdatePayload = { columns: debounceColumns };
      updateProjectColumns(payload);
    }
  }, [debounceColumns, params.projectId, updateProjectColumns]);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(pointerSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (active.data.current?.type === "column") {
      const column = active.data.current?.column as Column;
      setActiveColumn(column);
    } else if (active.data.current?.type === "task") {
      const task = active.data.current?.task;
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    if (active.data.current?.type === "column" && over?.id) {
      setColumns((prev) => {
        const activeIndex = prev.findIndex((c) => c.id === active.id);
        const overIndex = prev.findIndex((c) => c.id === over.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const isActiveColumn = active.data.current?.type === "column";
    if (isActiveColumn) return;
    const isOverColumn = over.data.current?.type === "column";

    const isActiveTask = active.data.current?.type === "task";
    const isOverTask = over.data.current?.type === "task";

    if (isActiveTask && isOverTask) {
      setTasks((prev) => {
        const activeTaskIndex = prev.findIndex((t) => t.id === active.id);
        const overTaskIndex = prev.findIndex((t) => t.id === over.id);

        prev[activeTaskIndex].columnId = prev[overTaskIndex].columnId

        return arrayMove(prev, activeTaskIndex, overTaskIndex);
      });
    } else if (isActiveTask && isOverColumn) {
      setTasks((prev) => {
        const activeTaskIndex = prev.findIndex((t) => t.id === active.id);
        const overColumnId = over.id as string;

        prev[activeTaskIndex].columnId = overColumnId;

        return [...prev]
      });
    }
  };

  if (isColumnLoading || isTaskLoading) {
    return <Loading />;
  }

  if (columnError || taskError) {
    return <div className="py-2 text-red-400">Error loading projects</div>;
  }

  if (!columns || columns.length === 0) {
    return (
      <div className="py-2 text-muted-foreground">
        No columns found for this project.
      </div>
    );
  }
  return (
    <div className="scrollbar-thin flex h-full w-full items-start justify-start gap-4 overflow-x-auto overflow-y-hidden scrollbar-thumb-gray-400 scrollbar-track-transparent">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext
          items={columnIdList}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((column) => (
            <SortableColumn
              column={column}
              key={column.id}
              tasks={tasks.filter((t) => t.columnId === column.id)}
            />
          ))}
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <SortableColumn
                column={activeColumn}
                tasks={tasks.filter((t) => t.columnId === activeColumn.id)}
              />
            )}
            {activeTask && <SortableTask task={activeTask} />}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
};

export default ProjectColumnView;
