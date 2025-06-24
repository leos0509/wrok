import { useGetColumnTasks } from "@/hooks/useColumn";
import { useUpdateTaskPosition } from "@/hooks/useTask";
import type { Task } from "@/types/task";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import TaskCard from "./TaskCard";

type ColumnTaskListProps = {
  columnId: string;
};

const ColumnTaskList = ({ columnId }: ColumnTaskListProps) => {
  const { data, isLoading, isSuccess, isError } = useGetColumnTasks(columnId);
  const [tasks, setTasks] = useState<Task[] | null>();
  const { mutate } = useUpdateTaskPosition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (isSuccess && data) {
      setTasks(data);
    }
  }, [isSuccess, data]);

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
    mutate(payload);
  };

  if (isLoading) return <Loading />;

  if (isError)
    return <div className="py-2 text-red-500">Failed to load tasks</div>;

  if (!tasks || !tasks.length)
    return <div className="py-2 text-muted-foreground">No tasks available</div>;

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

export default ColumnTaskList;
