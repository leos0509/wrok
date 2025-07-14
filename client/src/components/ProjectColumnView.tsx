import { useGetProjectColumns } from "@/hooks/useProject";
import { useParams } from "@tanstack/react-router";
import Loading from "./Loading";
import SortableColumn from "./SortableColumn";

const ProjectColumnView = () => {
  const params = useParams({ from: "/dashboard/_layout/projects/$projectId" });
  const {
    data: columns,
    isLoading: isColumnLoading,
    error: columnError,
  } = useGetProjectColumns(params.projectId || "", Boolean(params.projectId));

  if (isColumnLoading) {
    return <Loading />;
  }

  if (columnError) {
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
    <div className="scrollbar-thin flex h-full w-full items-start justify-start gap-4 overflow-x-auto overflow-y-hidden scrollbar-thumb-gray-400 scrollbar-track-transparent p-1">
      {columns.map((column) => (
        <SortableColumn
          column={column}
          key={column.id}
        />
      ))}
    </div>
  );
};

export default ProjectColumnView;
