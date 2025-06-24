import SortableColumn from "@/components/SortableColumn";
import { useUpdateColumn } from "@/hooks/useColumn";
import { useGetProjectColumns } from "@/hooks/useProject";
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
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import { restrictToHorizontalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

const ProjectColumnView = () => {
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
    <div className="flex w-full overflow-x-auto py-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement, restrictToHorizontalAxis]}
      >
        <SortableContext
          items={columns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((column) => (
            <SortableColumn key={column.id} column={column} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ProjectColumnView;
