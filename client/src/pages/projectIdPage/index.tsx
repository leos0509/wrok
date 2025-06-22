import Loading from "@/components/Loading";
import PageHeader from "@/components/PageHeader";
import { useGetProjectById } from "@/hooks/useProject";
import { useParams } from "@tanstack/react-router";

const ProjectIdPage = () => {
  const params = useParams({ from: "/dashboard/_layout/projects/$projectId" });
  const { data, isLoading, isError } = useGetProjectById(
    params.projectId || "",
  );

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }
    if (isError) {
      return (
        <div className="py-2 text-red-400">Error loading project details</div>
      );
    }
    if (!data) {
      return <div className="py-2 text-muted-foreground">Project not found</div>;
    }
    return (
      <div className="py-2">
        
      </div>
    );
  };
  return (
    <>
      <PageHeader
        title={`${data?.name || "Unknown"}`}
        description={data?.description || "This project does not have a description."}
      />
      <div>{renderContent()}</div>
    </>
  );
};

export default ProjectIdPage;
