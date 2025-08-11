import { useParams } from "@tanstack/react-router";
import BoardProvider from "./BoardProvider";
import ColumnList from "./ColumnList";

const ProjectColumnView = () => {
  const projectId = useParams({
    from: "/dashboard/_layout/projects/$projectId",
  }).projectId;

  return (
    <BoardProvider projectId={projectId}>
      <div className="scrollbar-thin flex h-full w-full items-start justify-start gap-4 overflow-x-auto overflow-y-hidden p-1 scrollbar-thumb-gray-400 scrollbar-track-transparent">
        <ColumnList />
      </div>
    </BoardProvider>
  );
};

export default ProjectColumnView;
