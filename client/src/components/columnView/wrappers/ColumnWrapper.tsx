import { type Column as TColumn } from "@/types/column";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Column from "../Column";

type ColumnWrapperProps = {
  column: TColumn;
};

const ColumnWrapper = ({ column }: ColumnWrapperProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: column.id,
      data: { type: "column", column },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="h-full"
    >
      <Column column={column} isDragging={isDragging} />
    </div>
  );
};

export default ColumnWrapper;
