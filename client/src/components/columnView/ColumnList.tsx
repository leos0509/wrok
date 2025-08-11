import { useBoardContext } from "@/hooks/useBoardContext";
import ColumnWrapper from "./wrappers/ColumnWrapper";
import { SortableContext } from "@dnd-kit/sortable";

const ColumnList = () => {
  const { columns } = useBoardContext();

  return (
    <SortableContext items={columns.map((column) => column.id)}>
      {columns.map((column) => (
        <ColumnWrapper key={column.id} column={column} />
      ))}
    </SortableContext>
  );
};

export default ColumnList;
