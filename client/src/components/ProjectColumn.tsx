import { useUpdateColumn } from "@/hooks/useColumn";
import { useGetProjectColumns } from "@/hooks/useProject";
import type { Column } from "@/types/column";
import type { Task } from "@/types/task";
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
import { GripVerticalIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import TaskCard from "./TaskCard";
import { Button } from "./ui/button";

const taskList: Task[] = [
  {
    id: "1",
    projectId: "project1",
    columnId: "column1",
    title: "Task 1",
    description: "This is the first task.",
    position: 1,
    imgUrl: "",
    startDate: "2023-10-01",
    endDate: "2023-10-05",
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-02T12:00:00Z",
    assignees: [
      {
        id: "user1",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        imgUrl: "https://picsum.photos/id/1/200/300",
        createdAt: "2023-01-01T12:00:00Z",
        updatedAt: "2023-01-02T12:00:00Z",
      },
    ],
  },
  {
    id: "2",
    projectId: "project1",
    columnId: "column1",
    title: "Task 2",
    description: "This is the second task.",
    position: 2,
    imgUrl: "",
    startDate: "2023-10-02",
    endDate: "2023-10-06",
    createdAt: "2023-10-02T12:00:00Z",
    updatedAt: "2023-10-03T12:00:00Z",
  },
];

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

    mutate(columnMap)
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
    <div
      className="flex h-full min-w-0 overflow-x-auto py-2"
    >
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.id,
      transition: { duration: 200, easing: "ease-in-out" },
      disabled,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: column.color,
  };

  const handleMouseDown = () => {
    setDisabled(false);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="mr-2 flex h-fit max-h-full min-h-[400px] min-w-[300px] flex-col gap-1 rounded-lg bg-card p-2 shadow"
    >
      <div className="flex items-center justify-between gap-2 py-1">
        <div className="flex items-center gap-1">
          <button className="bg-transparent p-1" onMouseDown={handleMouseDown}>
            <GripVerticalIcon className="size-4 text-muted-foreground hover:cursor-grab hover:text-foreground" />
          </button>
          <h2 className="font-display font-semibold">{column.name}</h2>
        </div>
        <Button variant="ghost" size="iconSm" className="rounded-full">
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        {taskList.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
