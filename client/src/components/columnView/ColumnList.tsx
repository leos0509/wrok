import { useGetProjectColumns } from "@/hooks/useProject";
import { SortableContext } from "@dnd-kit/sortable";
import { useParams } from "@tanstack/react-router";
import Loading from "../Loading";
import ColumnWrapper from "./wrappers/ColumnWrapper";

const ColumnList = () => {
  const projectId = useParams({
    from: "/dashboard/_layout/projects/$projectId",
  }).projectId;
  const {
    data: columns = [],
    isLoading,
    error,
  } = useGetProjectColumns(projectId, Boolean(projectId));

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Error loading columns
      </div>
    );
  }

  return (
    <SortableContext items={columns.map((column) => column.id)}>
      {columns.map((column) => (
        <ColumnWrapper key={column.id} column={column} />
      ))}
    </SortableContext>
  );
};

export default ColumnList;
