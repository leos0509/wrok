import AddMemberDialog from "@/components/dialogs/AddMemberDialog";
import CreateColumnDialog from "@/components/dialogs/CreateColumnDialog";
import Loading from "@/components/Loading";
import PageHeader from "@/components/PageHeader";
import ProjectColumnView from "@/components/ProjectColumnView";
import ProjectListView from "@/components/ProjectListView";
import ProjectMemberView from "@/components/ProjectMemberView";
import { Button } from "@/components/ui/button";
import { useGetProjectById } from "@/hooks/useProject";
import { cn } from "@/lib/utils";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Plus, SquareKanbanIcon, TableIcon, UsersIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/_layout/projects/$projectId")({
  component: ProjectDetailPage,
});

const ViewList = [
  {
    icon: <SquareKanbanIcon className="size-4" />,
    label: "Columns",
  },
  {
    icon: <TableIcon className="size-4" />,
    label: "Lists",
  },
  {
    icon: <UsersIcon className="size-4" />,
    label: "Members",
  },
];

function ProjectDetailPage() {
  const [activeView, setActiveView] = useState(ViewList[0].label);
  const params = useParams({ from: "/dashboard/_layout/projects/$projectId" });
  const { data, isLoading, isError } = useGetProjectById(
    params.projectId || "",
  );

  const renderView = () => {
    if (isLoading) {
      return <Loading />;
    }
    if (isError) {
      return (
        <div className="py-2 text-red-400">Error loading project details</div>
      );
    }
    if (!data) {
      return (
        <div className="py-2 text-muted-foreground">Project not found</div>
      );
    }
    return (
      <>
        {activeView === "Columns" && (
          <div className="h-full overflow-hidden">
            <ProjectColumnView />
          </div>
        )}
        {activeView === "Lists" && (
          <div className="h-full overflow-hidden">
            <ProjectListView />
          </div>
        )}
        {activeView === "Members" && (
          <div className="h-full overflow-hidden">
            <ProjectMemberView />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="page-container flex flex-col gap-1 overflow-hidden py-2">
      <PageHeader
        title={`${data?.name || "Unknown"}`}
        description={
          data?.description || "This project does not have a description."
        }
      />

      <div className="flex h-full flex-col gap-2 overflow-hidden px-4 py-2">
        {/* View Select */}
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-display">
            {ViewList.map((view) => (
              <Button
                key={view.label}
                variant="outline"
                className={cn(
                  "text-muted-foreground hover:bg-muted",
                  activeView === view.label &&
                    "bg-accent text-accent-foreground",
                )}
                onClick={() => setActiveView(view.label)}
              >
                {view.icon}
                <span>{view.label}</span>
              </Button>
            ))}
          </div>
          <div>
            {activeView === "Columns" && (
              <CreateColumnDialog
                trigger={
                  <Button
                    variant="default"
                    className="flex items-center justify-center gap-1"
                  >
                    <Plus className="size-4" />
                    <span className="leading-[100%]">Add Column</span>
                  </Button>
                }
              />
            )}
            {activeView === "Members" && (
              <AddMemberDialog>
                <Button
                  variant="default"
                  className="flex items-center justify-center gap-1"
                >
                  <Plus className="size-4" />
                  <span className="leading-[100%]">Add Member</span>
                </Button>
              </AddMemberDialog>
            )}
          </div>
        </div>
        {/* View Render */}
        {renderView()}
      </div>
    </div>
  );
}
