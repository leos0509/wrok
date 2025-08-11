import { BoardContext } from "@/hooks/useBoardContext";
import { useGetProjectColumns, useGetProjectTasks } from "@/hooks/useProject";
import { useUpdateSingleTask } from "@/hooks/useTask";
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
import { arrayMove } from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import ColumnOverlay from "./overlays/ColumnOverlay";
import TaskCardOverlay from "./overlays/TaskCardOverlay";

type BoardProviderProps = {
  children: React.ReactNode;
  projectId: string;
};

const BoardProvider = ({ projectId, children }: BoardProviderProps) => {
  const {
    data: tasksData = [],
    isLoading: tasksLoading,
    isSuccess: taskSuccess,
    error: tasksError,
  } = useGetProjectTasks(projectId, Boolean(projectId));

  const {
    data: columnsData = [],
    isLoading: columnsLoading,
    isSuccess: columnSuccess,
    error: columnsError,
  } = useGetProjectColumns(projectId, Boolean(projectId));

  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<TColumn[]>([]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<TColumn | null>(null);

  const { mutate: updateTask } = useUpdateSingleTask();

  useEffect(() => {
    if (taskSuccess && tasksData) {
      setTasks(tasksData);
    }
  }, [taskSuccess, tasksData]);

  useEffect(() => {
    if (columnSuccess && columnsData) {
      setColumns(columnsData);
    }
  }, [columnSuccess, columnsData]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  if (tasksLoading || columnsLoading) {
    return <Loading />;
  }

  if (!tasks || !columns || tasksError || columnsError) {
    return <div>Error loading board data</div>;
  }

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;

    if (!active.data.current) return;

    if (active.data.current.type === "task") {
      setActiveTask(active.data.current.task);
    } else if (active.data.current.type === "column") {
      setActiveColumn(active.data.current.column);
    }
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!active || !over) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    if (!activeData || !overData) return;

    if (active.id === over.id) return;

    if (activeData.type === "task" && overData.type === "task") {
      if (activeData.task.columnId === overData.task.columnId) return;

      const updatedTask = {
        ...activeData.task,
        columnId: overData.task.columnId,
      };

      updateTask(updatedTask);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === activeData.task.id ? updatedTask : task,
        ),
      );
    }

    if (activeData.type === "task" && overData.type === "column") {
      const activeTask = activeData.task as Task;
      const overColumn = overData.column as TColumn;

      // Task already in the target column → no change
      if (activeTask.columnId === overColumn.id) return;

      const updatedTask = { ...activeTask, columnId: overColumn.id };

      updateTask(updatedTask);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === activeTask.id ? updatedTask : task,
        ),
      );
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!active || !over) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    if (!activeData || !overData) return;

    // No movement if dragged onto itself
    if (active.id === over.id) return;

    if (activeData.type === "task" && overData.type === "task") {
      const activeTask = activeData.task as Task;
      const overTask = overData.task as Task;

      const updateActiveTask = {
        ...activeTask,
        order: overTask.order,
      };

      const updateOverTask = {
        ...overTask,
        order: activeTask.order,
      };

      updateTask(updateActiveTask);
      updateTask(updateOverTask);

      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex(
          (task) => task.id === activeTask.id,
        );
        const overIndex = prevTasks.findIndex(
          (task) => task.id === overTask.id,
        );

        if (activeIndex === -1 || overIndex === -1) return prevTasks;

        return arrayMove(prevTasks, activeIndex, overIndex);
      });
    }

    if (activeData.type === "column") {
      if (overData.type !== "column") return;

      const activeColumn = activeData.column as TColumn;
      const overColumn = overData.column as TColumn;

      setColumns((prevColumns) => {
        const activeIndex = prevColumns.findIndex(
          (column) => column.id === activeColumn.id,
        );
        const overIndex = prevColumns.findIndex(
          (column) => column.id === overColumn.id,
        );

        if (activeIndex === -1 || overIndex === -1) return prevColumns;

        return arrayMove(prevColumns, activeIndex, overIndex);
      });
    }

    setActiveTask(null);
    setActiveColumn(null);
  };

  const getTaskById = (taskId: string) =>
    tasks.find((task) => task.id === taskId);

  const getColumnById = (columnId: string) =>
    columns.find((column) => column.id === columnId);

  const getColumnTasks = (columnId: string) =>
    tasks
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => a.order - b.order);

  return (
    <BoardContext
      value={{
        columns: columns,
        tasks: tasks,
        getTaskById,
        getColumnById,
        getColumnTasks,
      }}
    >
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
    </BoardContext>
  );
};

export default BoardProvider;
