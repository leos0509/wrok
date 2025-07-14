import { useGetProjectColumns } from "@/hooks/useProject";
import { useParams } from "@tanstack/react-router";
import Loading from "./Loading";
import ColumnAccordion from "./ColumnAccordion";

const ProjectListView = () => {
  const params = useParams({ from: "/dashboard/_layout/projects/$projectId" });
  const {
    data: columnData,
    isLoading: isColumnLoading,
    error: columnError,
  } = useGetProjectColumns(params.projectId || "", Boolean(params.projectId));

  const renderColumnTables = () => {
    if (isColumnLoading) return <Loading />;
    if (columnError) {
      return <div className="py-2 text-red-400">Error loading columns</div>;
    }
    if (!columnData || columnData.length === 0) {
      return <div className="py-2 text-muted-foreground">No columns found</div>;
    }
    return columnData.map((column) => (
      <ColumnAccordion col={column} key={column.id} />
    ));
  };

  return (
    <div className="scrollbar-thin max-h-full h-full w-full overflow-y-auto scrollbar-thumb-gray-400 scrollbar-track-transparent flex flex-col gap-4 p-1">
        {renderColumnTables()}
    </div>
  );
};

export default ProjectListView;
