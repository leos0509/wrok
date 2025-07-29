import { PlusIcon } from "lucide-react";
import ChecklistTable from "./ChecklistTable";
import { Button } from "./ui/button";
import { useCreateTaskChecklist, useGetTaskChecklists } from "@/hooks/useTask";
import Loading from "./Loading";

type ChecklistSectionProps = {
  taskId: string;
};

const ChecklistSection = ({ taskId }: ChecklistSectionProps) => {
  const {
    data: taskChecklists,
    isLoading,
    error,
  } = useGetTaskChecklists(taskId, true);

  const { mutate: createTaskChecklist } = useCreateTaskChecklist();

  const handleCreateChecklist = () => {
    createTaskChecklist(taskId);
  };

  const renderChecklists = () => {
    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <p className="text-muted-foreground">Error loading checklists.</p>;
    }

    if (!taskChecklists || taskChecklists.length === 0) {
      return <p>No checklists available for this task.</p>;
    }

    return taskChecklists.map((checklist) => (
      <ChecklistTable key={checklist.id} checklistId={checklist.id} />
    ));
  };

  return (
    <div className="flex w-full flex-col gap-2 py-2">
      <div className="flex items-center justify-between">
        <h4 className="px-1 font-display text-lg font-semibold">Checklists</h4>
        <Button
          variant="ghost"
          className="kh-8 w-8 rounded-lg p-0"
          aria-label="Add new checklist"
          onClick={handleCreateChecklist}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
      <div className="flex w-full flex-col items-start justify-start min-h-32 gap-2">
        {renderChecklists()}
      </div>
    </div>
  );
};

export default ChecklistSection;
