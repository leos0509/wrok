import CreateColumnDialog from "@/components/dialog/CreateColumnDialog";
import Loading from "@/components/Loading";
import PageHeader from "@/components/PageHeader";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { useGetProjectById, useGetProjectColumns } from "@/hooks/useProject";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";
import { useParams } from "@tanstack/react-router";
import { GripVerticalIcon, Plus } from "lucide-react";
import { useState } from "react";

const ViewList = [
  {
    label: "Columns",
  },
  {
    label: "Tasks",
  },
  {
    label: "Members",
  },
];

const ProjectIdPage = () => {
  const [activeView, setActiveView] = useState(ViewList[0].label);
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
      return (
        <div className="py-2 text-muted-foreground">Project not found</div>
      );
    }
    return (
      <div className="w-full py-2">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-display">
            <h1 className="mr-2 text-xl font-semibold">Views:</h1>
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
                {view.label}
              </Button>
            ))}
          </div>
          <div>
            {activeView === "Columns" && (
              <CreateColumnDialog
                trigger={
                  <Button variant="default">
                    <Plus className="size-4" />
                    Add Column
                  </Button>
                }
              />
            )}
          </div>
        </div>
        <div className="w-full py-2">
          {activeView === "Columns" && <ProjectColumns />}
          {activeView === "Tasks" && (
            <div className="py-2 text-muted-foreground">
              Tasks view is under construction.
            </div>
          )}
          {activeView === "Members" && (
            <div className="py-2 text-muted-foreground">
              Members view is under construction.
            </div>
          )}
        </div>
      </div>
    );
  };
  return (
    <>
      <PageHeader
        title={`${data?.name || "Unknown"}`}
        description={
          data?.description || "This project does not have a description."
        }
      />
      {renderContent()}
    </>
  );
};

export default ProjectIdPage;

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
      {
        id: "user2",
        firstName: "Jane",
        lastName: "Smith",
        email: "janesmith@gmail.com",
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
  const { data, isLoading, isError } = useGetProjectColumns(
    params.projectId || "",
    Boolean(params.projectId),
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="py-2 text-red-400">Error loading project columns</div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-2 text-muted-foreground">No columns available</div>
    );
  }

  return (
    <div
      className="flex max-w-full overflow-x-auto py-2"
      style={{ transform: "scaleY(-1)" }}
    >
      <div className="inline-flex gap-2" style={{ transform: "scaleY(-1)" }}>
        {data.map((column) => (
          <div
            key={column.id}
            className="flex max-h-[1000px] min-h-[400px] min-w-[300px] flex-col gap-1 overflow-hidden rounded-lg bg-card p-2 shadow"
            style={{ background: `${column.color}` }}
          >
            <div className="flex items-center justify-between gap-2 py-1">
              <div className="flex items-center gap-1">
                <GripVerticalIcon className="size-4 text-muted-foreground hover:cursor-grab hover:text-foreground" />
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
        ))}
      </div>
    </div>
  );
};
